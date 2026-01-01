import React, { createContext, useState, useRef, useCallback, useEffect } from 'react';
// Replace with your actual config path
import { GET_NS_MONITORING_URL } from '../config/url';

// Define the structure of the resource message received from WebSocket
export interface ResourceMessage {
  type: string;
  name: string;
  ns: string;
  status?: string;
  kind?: string;
  age?: string;
  clusterIP?: string;
  externalIP?: string;
  externalIPs?: string[];
  nodePorts?: number[];
  serviceType?: string;
  containers?: string[];
  metadata?: {
    deletionTimestamp?: string | null;
    creationTimestamp?: string;
    labels?: Record<string, string>;
  };
}

interface WebSocketContextType {
  messages: ResourceMessage[];
  connectToNamespace: (namespace: string) => void;
  getNamespaceMessages: (namespace: string) => ResourceMessage[];
  clearMessages: () => void;
}

export const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ResourceMessage[]>([]);

  // Registry to store active WebSocket instances.
  // Using useRef prevents re-renders when sockets change and keeps connections stable.
  const sockets = useRef<Record<string, WebSocket>>({});

  /**
   * Helper function to determine if a message indicates a resource deletion.
   * Checks for:
   * 1. Explicit 'DELETED' event type.
   * 2. 'deletionTimestamp' in metadata (Terminating state).
   */
  const isDeletionEvent = (msg: ResourceMessage): boolean => {
    // Standard K8s deletion event
    if (msg.type === 'DELETED') return true;

    // Resource is marked for deletion (Terminating)
    if (msg.metadata?.deletionTimestamp) return true;

    // Optional: Logic to remove completed jobs/pods if desired.
    // Currently, we usually keep them to show status logs.
    // if (msg.phase === 'Succeeded' || msg.phase === 'Failed') return false;

    return false;
  };

  const connectToNamespace = useCallback((ns: string) => {
    // Check if a healthy connection already exists for this namespace to avoid duplicates
    if (
      sockets.current[ns] &&
      (sockets.current[ns].readyState === WebSocket.OPEN ||
        sockets.current[ns].readyState === WebSocket.CONNECTING)
    ) {
      // console.log(`[WS Pool] Already connected to ${ns}, skipping.`);
      return;
    }

    const url = GET_NS_MONITORING_URL(ns);
    console.log(`%c[WS Pool] Opening Connection: ${ns}`, 'color: #10b981; font-weight: bold;');

    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log(`[WS Pool] Connected to ${ns}.`);
      // If backend requires a subscription signal, send it here.
      // ws.send(JSON.stringify({ action: 'subscribe', namespace: ns }));
    };

    ws.onmessage = (event) => {
      try {
        const rawData = JSON.parse(event.data);

        // Normalize data to an array to handle both single objects (legacy) and batched arrays (optimized).
        const batchUpdates: ResourceMessage[] = Array.isArray(rawData) ? rawData : [rawData];

        // Skip empty updates (e.g., heartbeats)
        if (batchUpdates.length === 0) return;

        setMessages((prev) => {
          // Create a shallow copy of the current state to mutate safely
          const nextMessages = [...prev];

          // Process all messages in the batch efficiently
          batchUpdates.forEach((msg) => {
            // Validation: Ensure essential fields exist
            if (!msg.kind || !msg.name) return;

            // Create a unique key to identify the resource
            const key = `${msg.kind}-${msg.name}-${msg.ns}`;

            // Find if the resource already exists in our local state
            const existingIndex = nextMessages.findIndex(
              (m) => `${m.kind}-${m.name}-${m.ns}` === key,
            );

            // --- Deletion Logic ---
            if (isDeletionEvent(msg)) {
              if (existingIndex >= 0) {
                // Remove the resource from the list
                nextMessages.splice(existingIndex, 1);
                // console.log(`[WS Pool] Deleted: ${msg.name}`);
              }
              return; // Move to next message
            }

            // --- Update / Add Logic ---
            if (existingIndex >= 0) {
              // UPDATE: Merge existing data with new data.
              // Crucial: Preserves fields that might not be in the update payload (partial updates).
              nextMessages[existingIndex] = {
                ...nextMessages[existingIndex],
                ...msg,
              };
            } else {
              // ADD: Append new resource to the list
              nextMessages.push(msg);
            }
          });

          // Buffer Limit: Keep only the last 1000 messages to prevent memory overflow in long-running sessions.
          return nextMessages.slice(-1000);
        });
      } catch (e) {
        console.error(`[WS Pool] Parse error for ${ns}:`, e);
      }
    };

    ws.onclose = (e) => {
      console.log(`[WS Pool] Closed ${ns} (Code: ${e.code})`);
      delete sockets.current[ns];
    };

    ws.onerror = (err) => {
      console.error(`[WS Pool] Error on ${ns}:`, err);
      // Ensure the socket is closed and removed from the pool
      try {
        ws.close();
      } catch {
        /* intentionally ignore close errors */
      }
      delete sockets.current[ns];
    };

    // Store the socket instance in the ref
    sockets.current[ns] = ws;
  }, []);

  const getNamespaceMessages = useCallback(
    (namespace: string) => {
      return messages.filter((m) => m.ns === namespace);
    },
    [messages],
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Cleanup effect: Close all sockets when the provider unmounts (e.g., user navigates away or logs out)
  useEffect(() => {
    const currentSockets = sockets.current;
    return () => {
      console.log('[WS Pool] Cleaning up all sockets...');
      Object.values(currentSockets).forEach((s) => s.close());
    };
  }, []);

  return (
    <WebSocketContext.Provider
      value={{ messages, connectToNamespace, getNamespaceMessages, clearMessages }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
