export const WEBSOCKET_MONITORING_URL = (namespace: string) => 
  `ws://10.121.124.22:30080/ws/monitoring/${namespace}`;

export const connectWebSocket = (namespace: string, onMessage: (data: any) => void) => {
  const ws = new WebSocket(WEBSOCKET_MONITORING_URL(namespace));

  ws.onopen = () => {
    console.log(`WebSocket connected to ${namespace}`);
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data); // Process the incoming data
  };

  ws.onerror = (error) => {
    console.error("WebSocket error: ", error);
  };

  ws.onclose = () => {
    console.log("WebSocket connection closed");
  };

  return ws;
};
