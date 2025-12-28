import { useState, useEffect } from 'react';
import { getUsername } from '../services/authService';
import { WEBSOCKET_MONITORING_URL } from '../config/url';

/**
 * Interface defining the structure of a resource message received from the WebSocket.
 * It's designed to accommodate both standard Kubernetes resources (like Pods)
 * and specific resource types (like Services) with their unique fields.
 */
export interface ResourceMessage {
  type: string; // Event type, e.g., "ADDED", "MODIFIED", "DELETED"
  name: string; // Resource name
  ns: string; // Namespace
  status?: string; // Resource status, e.g., "Running" (Optional, typically for Pods)
  kind?: string; // Resource kind, e.g., "Pod", "Service" (Optional)
  age?: string; // Resource age, e.g., "17d" (Optional)
  // Service-specific optional fields added for parsing the example data

  clusterIP?: string;
  externalIP?: string; // New field for the single external IP
  externalIPs?: string[]; // New field for the array of external IPs
  nodePorts?: number[]; // K8s nodePorts are typically numbers
  serviceType?: string; // Used to store the Service 'type' (e.g., NodePort, LoadBalancer) to avoid conflict with the event 'type'
  containers?: string[]; // List of container names for Pods
}

/**
 * Custom React Hook for connecting to and managing a WebSocket for Kubernetes resource monitoring.
 * @param projectId The ID of the current project.
 * @returns An array of ResourceMessage objects representing the current state of monitored resources.
 */
const useWebSocket = (projectId: string) => {
  const username = getUsername(); // Get the current username
  const namespace = `proj-${projectId}-${username}`; // Dynamically generate the Namespace based on project and user
  const [messages, setMessages] = useState<ResourceMessage[]>([]); // State to store received messages

  useEffect(() => {
    let ws: WebSocket; // WebSocket instance
    const connect = () => {
      const wsUrl = WEBSOCKET_MONITORING_URL(namespace);
      console.log('Attempting to connect to:', wsUrl);
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected to', namespace);
      };

      ws.onmessage = (event) => {
        console.log('Received message:', event.data);
        try {
          const data = JSON.parse(event.data); // Parse the raw JSON data

          // Adjust the data structure for Service resources if necessary
          // This ensures that Service-specific fields are correctly mapped to ResourceMessage.
          const parsedData: ResourceMessage =
            data.kind === 'Service'
              ? {
                  ...data,
                  // Map the k8s Service type (e.g. ClusterIP, NodePort) to serviceType
                  serviceType: data.type,
                  // Keep the event type (ADDED/MODIFIED/DELETED) in the main 'type' field
                  type: data.type,
                  // Note: The parsing logic relies on the fact that standard JSON.parse
                  // and the spread operator '...' will automatically include all extra
                  // fields (clusterIP, externalIP, etc.) if they are defined in the interface.
                }
              : data;

          console.log(event.data);
          // Only process messages relevant to the current user's namespace
          if (parsedData.ns === namespace) {
            setMessages((prev) => {
              // Define a unique key (name + namespace)
              const key = `${parsedData.name}-${parsedData.ns}`; // Check if the resource already exists in the state
              const existingIndex = prev.findIndex((msg) => `${msg.name}-${msg.ns}` === key);
              if (existingIndex >= 0) {
                // If exists, update the existing entry by merging new data
                const updatedMessages = [...prev];
                updatedMessages[existingIndex] = {
                  ...updatedMessages[existingIndex],
                  ...parsedData, // This merge correctly updates all fields including new Service data
                };
                return updatedMessages;
              } else {
                // If not exists, add the new item
                return [...prev, parsedData].slice(-100); // Limit to max 100 messages for performance
              }
            });
          }
        } catch (e) {
          console.error('Invalid message format:', e);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error details:', error);
      };

      ws.onclose = (event) => {
        console.log(
          'WebSocket closed for',
          namespace,
          'Code:',
          event.code,
          'Reason:',
          event.reason,
        );
        if (event.code === 1006) {
          // Abnormal closure (e.g., server disconnect), attempt to reconnect
          console.log('Retrying connection in 2s...');
          setTimeout(connect, 2000);
        }
      };
    };

    connect(); // Initiate the WebSocket connection
    // Cleanup function: runs on component unmount or dependency change

    return () => ws?.close();
  }, [projectId]); // Reconnect when projectId changes

  return messages; // Return the message array for component use
};

export default useWebSocket;
