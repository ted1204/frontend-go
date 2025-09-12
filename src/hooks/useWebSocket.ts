import { useState, useEffect } from "react";
import { getUsernameFromToken } from "../services/authService";

export interface ResourceMessage {
  type: string; // 事件類型，例如 "ADDED", "MODIFIED", "DELETED"
  name: string; // 資源名稱
  ns: string; // Namespace
  status: string; // 資源狀態，例如 "Running"
  kind?: string; // 資源類型，例如 "Pod", "Service" (可選)
  age?: string; // 存活時間，例如 "17d" (可選)
}

const useWebSocket = (projectId: string, token: string) => {
  const username = getUsernameFromToken(); // 從 Token 獲取當前用戶名
  const namespace = `proj-${projectId}-${username}`; // 動態生成 Namespace
  const [messages, setMessages] = useState<ResourceMessage[]>([]); // 儲存接收到的訊息

  useEffect(() => {
    let ws: WebSocket; // WebSocket 實例
    const connect = () => {
      const wsUrl = `ws://10.121.124.22:30080/ws/monitoring/${namespace}`; // 後端 WebSocket URL
      console.log("Attempting to connect to:", wsUrl);
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("WebSocket connected to", namespace);
        // 後端不要求 Token，故不傳送
      };

      ws.onmessage = (event) => {
        console.log("Received message:", event.data);
        try {
          const data = JSON.parse(event.data) as ResourceMessage;
          if (data.ns === namespace) {
            setMessages((prev) => {
              // 定義唯一鍵 (name + namespace)
              const key = `${data.name}-${data.ns}`;
              // 檢查是否已有相同資源
              const existingIndex = prev.findIndex(
                (msg) => `${msg.name}-${msg.ns}` === key
              );
              if (existingIndex >= 0) {
                // 若存在，僅更新狀態
                const updatedMessages = [...prev];
                updatedMessages[existingIndex] = {
                  ...updatedMessages[existingIndex],
                  ...data,
                };
                return updatedMessages;
              } else {
                // 若不存在，添加新項
                return [...prev, data].slice(-100); // 限制最多 100 條訊息
              }
            });
          }
        } catch (e) {
          console.error("Invalid message format:", e);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error details:", error);
      };

      ws.onclose = (event) => {
        console.log("WebSocket closed for", namespace, "Code:", event.code, "Reason:", event.reason);
        if (event.code === 1006) { // 異常關閉，嘗試重連
          console.log("Retrying connection in 2s...");
          setTimeout(connect, 2000);
        }
      };
    };

    connect(); // 啟動連線

    // 清理函數，關閉 WebSocket
    return () => ws?.close();
  }, [projectId, token]); // 當 projectId 或 token 改變時重新連線

  return messages; // 回傳訊息陣列供組件使用
};

export default useWebSocket;