export const connectWebSocket = (url, onMessage) => {
    const ws = new WebSocket(url);
    ws.onopen = () => console.log('connected');
    ws.onmessage = (event) => {
        try {
            const parsed = JSON.parse(event.data);
            onMessage(parsed);
        }
        catch (err) {
            console.error('Failed to parse websocket message', err);
        }
    };
    ws.onerror = (err) => console.error('error', err);
    ws.onclose = () => console.log('closed');
    return ws;
};
