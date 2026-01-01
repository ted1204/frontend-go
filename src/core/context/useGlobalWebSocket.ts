import { useContext } from 'react';
import { WebSocketContext } from './WebSocketContext'; // English: Ensure named import matches your context file

/**
 * Custom hook to access the multi-namespace WebSocket connection pool.
 * English Comment: Provides access to messages, connection functions, and namespace-specific filters.
 */
export const useGlobalWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useGlobalWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export default useGlobalWebSocket;
