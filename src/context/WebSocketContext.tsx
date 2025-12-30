import React, { createContext, useState, useRef, useCallback, useEffect } from 'react';
import { ResourceMessage } from '../hooks/useWebSocket';
import { GET_NS_MONITORING_URL } from '../config/url';

interface WebSocketContextType {
  messages: ResourceMessage[];
  connectToNamespace: (namespace: string) => void;
  getProjectMessages: (namespace: string) => ResourceMessage[];
}

export const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ResourceMessage[]>([]);
  // English: Registry to store active WebSocket instances, preventing redundant connections
  const sockets = useRef<Record<string, WebSocket>>({});

  const connectToNamespace = useCallback((ns: string) => {
    // English: Check if a healthy connection already exists for this namespace
    if (
      sockets.current[ns] &&
      (sockets.current[ns].readyState === WebSocket.OPEN ||
        sockets.current[ns].readyState === WebSocket.CONNECTING)
    ) {
      console.log(`[WS Pool] Already connected/connecting to ${ns}, skipping.`);
      return;
    }

    const url = GET_NS_MONITORING_URL(ns);
    console.log(`%c[WS Pool] Opening Connection: ${ns}`, 'color: #8b5cf6; font-weight: bold;');

    const ws = new WebSocket(url);

    // --- English: ACTUALLY SUBSCRIBE ON OPEN ---
    ws.onopen = () => {
      console.log(`[WS Pool] Connected to ${ns}. Sending subscription signal...`);
      // English: Explicitly tell the backend to start watching this namespace
      const subMsg = {
        action: 'subscribe',
        namespace: ns,
      };
      ws.send(JSON.stringify(subMsg));
    };

    ws.onmessage = (event) => {
      try {
        const parsedData: ResourceMessage = JSON.parse(event.data);
        // English: Ignore heartbeat or malformed messages
        if (!parsedData.kind || !parsedData.name) return;

        setMessages((prev) => {
          const key = `${parsedData.name}-${parsedData.ns}`;
          const existingIndex = prev.findIndex((msg) => `${msg.name}-${msg.ns}` === key);

          if (existingIndex >= 0) {
            // English: Update existing resource status
            const newMessages = [...prev];
            newMessages[existingIndex] = { ...newMessages[existingIndex], ...parsedData };
            return newMessages;
          }
          // English: Append new resource message and maintain buffer limit
          return [...prev, parsedData].slice(-500);
        });
      } catch (e) {
        console.error(`[WS Pool] Parse error for ${ns}:`, e);
      }
    };

    ws.onclose = (e) => {
      console.log(`[WS Pool] Connection closed for ${ns}. Code: ${e.code}`);
      delete sockets.current[ns];
    };

    ws.onerror = (err) => {
      console.error(`[WS Pool] WebSocket error on ${ns}:`, err);
    };

    sockets.current[ns] = ws;
  }, []);

  const getProjectMessages = useCallback(
    (namespace: string) => {
      return messages.filter((m) => m.ns === namespace);
    },
    [messages],
  );

  // English: Ensure all pool connections are terminated when the provider unmounts
  useEffect(() => {
    return () => {
      Object.values(sockets.current).forEach((s) => s.close());
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ messages, connectToNamespace, getProjectMessages }}>
      {children}
    </WebSocketContext.Provider>
  );
};
