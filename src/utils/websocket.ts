export const connectWebSocket = (url: string, onMessage: (data: any) => void) => {
  const ws = new WebSocket(url);

  ws.onopen = () => console.log("connected");
  ws.onmessage = (event) => onMessage(JSON.parse(event.data));
  ws.onerror = (err) => console.error("error", err);
  ws.onclose = () => console.log("closed");

  return ws;
};