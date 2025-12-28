import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { WEBSOCKET_USER_MONITORING_URL } from '../config/url';
import { ResourceMessage } from '../hooks/useWebSocket';

interface WebSocketContextType {
  messages: ResourceMessage[];
  getProjectMessages: (namespace: string) => ResourceMessage[];
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ResourceMessage[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connect = () => {
      const wsUrl = WEBSOCKET_USER_MONITORING_URL();
      console.log('Connecting to global WebSocket:', wsUrl);

      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log('Global WebSocket connected');
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // Adjust the data structure for Service resources if necessary
          const parsedData: ResourceMessage =
            data.kind === 'Service'
              ? {
                  ...data,
                  serviceType: data.type,
                  type: data.type,
                }
              : data;

          setMessages((prev) => {
            const key = `${parsedData.name}-${parsedData.ns}`;
            const existingIndex = prev.findIndex((msg) => `${msg.name}-${msg.ns}` === key);

            if (existingIndex >= 0) {
              const newMessages = [...prev];
              newMessages[existingIndex] = {
                ...newMessages[existingIndex],
                ...parsedData,
              };
              return newMessages;
            } else {
              // Limit to 500 to prevent memory issues, but enough for multiple projects
              return [...prev, parsedData].slice(-500);
            }
          });
        } catch (e) {
          console.error('WS Parse Error', e);
        }
      };

      ws.current.onclose = (event) => {
        console.log('Global WebSocket closed, retrying...', event.code, event.reason);
        setTimeout(connect, 3000);
      };

      ws.current.onerror = (error) => {
        console.error('Global WebSocket error:', error);
      };
    };

    connect();

    return () => {
      ws.current?.close();
    };
  }, []);

  const getProjectMessages = (namespace: string) => {
    return messages.filter((m) => m.ns === namespace);
  };

  return (
    <WebSocketContext.Provider value={{ messages, getProjectMessages }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useGlobalWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useGlobalWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
