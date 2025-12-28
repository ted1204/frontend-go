import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useEffect, useState, useRef } from 'react';
import { WEBSOCKET_USER_MONITORING_URL } from '../config/url';
const WebSocketContext = createContext(undefined);
export const WebSocketProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const ws = useRef(null);
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
                    const parsedData = data.kind === 'Service'
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
                        }
                        else {
                            // Limit to 500 to prevent memory issues, but enough for multiple projects
                            return [...prev, parsedData].slice(-500);
                        }
                    });
                }
                catch (e) {
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
    const getProjectMessages = (namespace) => {
        return messages.filter((m) => m.ns === namespace);
    };
    return (_jsx(WebSocketContext.Provider, { value: { messages, getProjectMessages }, children: children }));
};
export default WebSocketContext;
