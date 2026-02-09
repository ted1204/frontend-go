import React, { useState, useRef, useCallback, useEffect } from 'react';
// Replace with your actual config path
import { GET_NS_MONITORING_URL, JOBS_WS_URL, POD_LOGS_WS_URL } from '../config/url';
import type { ResourceMessage } from './ws-types';
import { WebSocketContext } from './websocket-context';
export { WebSocketContext } from './websocket-context';
import { sanitizeK8sName } from '@nthucscc/utils';
// Define the structure of the resource message received from WebSocket
// ResourceMessage type moved to ./ws-types to avoid exporting non-components

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ResourceMessage[]>([]);

  // Registry to store active WebSocket instances.
  // Using useRef prevents re-renders when sockets change and keeps connections stable.
  const sockets = useRef<Record<string, WebSocket>>({});

  // Registry for opened log windows (managed by parent window)
  const logWindows = useRef<Record<string, Window | null>>({});

  // Registry for pod-log websockets and subscribers
  const podLogSockets = useRef<Record<string, WebSocket | undefined>>({});
  const podLogSubscribers = useRef<Record<string, Array<(line: string) => void>>>({});

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

    return false;
  };

  const connectToNamespace = useCallback((rawNs: string) => {
    // Sanitize the namespace before processing
    const ns = sanitizeK8sName(rawNs);

    if (!ns) {
      throw new Error('[WS Pool] Attempted to connect to invalid or empty namespace');
    }

    // Check if a healthy connection already exists for this namespace to avoid duplicates
    if (
      sockets.current[ns] &&
      (sockets.current[ns].readyState === WebSocket.OPEN ||
        sockets.current[ns].readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    const url = GET_NS_MONITORING_URL(ns);
    const ws = new WebSocket(url);

    ws.onopen = () => {
      // Connection opened
    };

    ws.onmessage = (event) => {
      try {
        const rawData = JSON.parse(event.data);

        // Normalize data to an array to handle both single objects (legacy) and batched arrays (optimized).
        const batchUpdates: ResourceMessage[] = Array.isArray(rawData) ? rawData : [rawData];

        // Skip empty updates (e.g., heartbeats)
        if (batchUpdates.length === 0) return;

        if (import.meta.env.DEV) {
          console.log('[WS Pool] Received batch update:', rawData);
        }

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
        if (import.meta.env.DEV) {
          console.error(`[WS Pool] Parse error for ${ns}:`, e);
        }
      }
    };

    ws.onclose = () => {
      delete sockets.current[ns];
    };

    ws.onerror = (err) => {
      if (import.meta.env.DEV) {
        console.error(`[WS Pool] Error on ${ns}:`, err);
      }
      // Ensure the socket is closed and removed from the pool
      try {
        ws.close();
      } catch (_error: unknown) {
        /* intentionally ignore close errors */
      }
      delete sockets.current[ns];
    };

    // Store the socket instance in the ref
    sockets.current[ns] = ws;

    // Ensure we have a jobs socket running so Job resources are also captured
    // This opens a single jobs socket (cluster-wide) and merges Job messages into `messages`.
    const jobsKey = '__jobs__';
    if (!sockets.current[jobsKey]) {
      try {
        const jobsWs = new WebSocket(JOBS_WS_URL());

        jobsWs.onopen = () => {
          // Jobs connection opened
        };

        jobsWs.onmessage = (event) => {
          try {
            const raw = JSON.parse(event.data);
            const batch: ResourceMessage[] = Array.isArray(raw) ? raw : [raw];
            if (batch.length === 0) return;

            setMessages((prev) => {
              const next = [...prev];
              batch.forEach((msg) => {
                // Only handle Job-kind messages (defensive)
                if (!msg.kind || msg.kind.toLowerCase() !== 'job') return;

                const key = `${msg.kind}-${msg.name}-${msg.ns}`;
                const idx = next.findIndex((m) => `${m.kind}-${m.name}-${m.ns}` === key);

                if (isDeletionEvent(msg)) {
                  if (idx >= 0) next.splice(idx, 1);
                  return;
                }

                if (idx >= 0) next[idx] = { ...next[idx], ...msg };
                else next.push(msg);
              });
              return next.slice(-1000);
            });
          } catch (e) {
            if (import.meta.env.DEV) {
              console.error('[WS Pool] Parse error on jobs feed:', e);
            }
          }
        };

        jobsWs.onclose = () => {
          delete sockets.current[jobsKey];
        };

        jobsWs.onerror = (err) => {
          if (import.meta.env.DEV) {
            console.error('[WS Pool] Jobs socket error:', err);
          }
          try {
            jobsWs.close();
          } catch (_error: unknown) {
            // ignore close error
          }
          delete sockets.current[jobsKey];
        };

        sockets.current[jobsKey] = jobsWs;
      } catch (e) {
        if (import.meta.env.DEV) {
          console.error('[WS Pool] Failed to open jobs websocket', e);
        }
      }
    }
  }, []);

  const getNamespaceMessages = useCallback(
    (rawNs: string) => {
      const ns = sanitizeK8sName(rawNs);
      return messages.filter((m) => m.ns === ns);
    },
    [messages],
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Cleanup effect: Close all sockets when the provider unmounts
  useEffect(() => {
    const currentSockets = sockets.current;
    const currentLogWindows = logWindows.current;
    return () => {
      if (import.meta.env.DEV) {
        console.log('[WS Pool] Cleaning up all sockets...');
      }
      Object.values(currentSockets).forEach((s) => s.close());
      // Close any opened log windows
      Object.values(currentLogWindows).forEach((w) => {
        try {
          w?.close();
        } catch (err) {
          if (import.meta.env.DEV) {
            console.debug('failed closing log window', err);
          }
        }
      });
    };
  }, []);

  const registerLogWindow = useCallback((key: string, win: Window | null) => {
    logWindows.current[key] = win;

    // Start a simple poll to detect when the window is closed and cleanup
    const interval = setInterval(() => {
      const w = logWindows.current[key];
      if (!w || w.closed) {
        delete logWindows.current[key];
        clearInterval(interval);
      }
    }, 1000);
  }, []);

  const unregisterLogWindow = useCallback((key: string) => {
    const w = logWindows.current[key];
    if (w && !w.closed) {
      try {
        w.close();
      } catch (_error: unknown) {
        if (import.meta.env.DEV) {
          console.debug('error closing log window');
        }
      }
    }
    delete logWindows.current[key];
  }, []);

  const subscribeToPodLogs = useCallback(
    (rawNamespace: string, pod: string, container: string, cb: (line: string) => void) => {
      // Ensure namespace is safe before using it in keys or URLs
      const namespace = sanitizeK8sName(rawNamespace);
      const key = `podlogs-${namespace}-${pod}-${container}`;

      if (!podLogSubscribers.current[key]) podLogSubscribers.current[key] = [];
      podLogSubscribers.current[key].push(cb);

      if (!podLogSockets.current[key]) {
        try {
          const wsUrl = POD_LOGS_WS_URL(namespace, pod, container);
          const ws = new WebSocket(wsUrl);

          ws.onmessage = (ev) => {
            const data = ev.data;

            const isLikelyJson =
              typeof data === 'string' && (data.startsWith('{') || data.startsWith('['));

            if (!isLikelyJson) {
              (podLogSubscribers.current[key] || []).forEach((s) => s(String(data)));
              return;
            }

            try {
              const parsed = JSON.parse(data);

              if (Array.isArray(parsed)) {
                parsed.forEach((p) => {
                  const line = typeof p === 'string' ? p : JSON.stringify(p);
                  (podLogSubscribers.current[key] || []).forEach((s) => s(line));
                });
              } else if (typeof parsed === 'object') {
                const line = JSON.stringify(parsed);
                (podLogSubscribers.current[key] || []).forEach((s) => s(line));
              } else {
                (podLogSubscribers.current[key] || []).forEach((s) => s(String(parsed)));
              }
            } catch (err) {
              if (import.meta.env.DEV) {
                console.log('[WS Pool] pod log parse error', err);
              }
              (podLogSubscribers.current[key] || []).forEach((s) => s(String(data)));
            }
          };

          ws.onclose = () => {
            delete podLogSockets.current[key];
            delete podLogSubscribers.current[key];
          };

          ws.onerror = (err) => {
            if (import.meta.env.DEV) {
              console.debug('[WS Pool] pod log socket error', err);
            }
            try {
              ws.close();
            } catch (errClose) {
              if (import.meta.env.DEV) {
                console.debug('error closing ws', errClose);
              }
            }
            delete podLogSockets.current[key];
          };

          podLogSockets.current[key] = ws;
        } catch (err) {
          if (import.meta.env.DEV) {
            console.debug('[WS Pool] failed to open pod logs ws', err);
          }
        }
      }

      // Return unsubscribe function
      return () => {
        const list = podLogSubscribers.current[key] || [];
        podLogSubscribers.current[key] = list.filter((f) => f !== cb);
        if ((podLogSubscribers.current[key] || []).length === 0) {
          const ws = podLogSockets.current[key];
          if (ws) {
            try {
              ws.close();
            } catch (errClose) {
              if (import.meta.env.DEV) {
                console.debug('error closing pod log ws', errClose);
              }
            }
          }
          delete podLogSockets.current[key];
          delete podLogSubscribers.current[key];
        }
      };
    },
    [],
  );

  return (
    <WebSocketContext.Provider
      value={{
        messages,
        connectToNamespace,
        getNamespaceMessages,
        clearMessages,
        registerLogWindow,
        unregisterLogWindow,
        subscribeToPodLogs,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
