import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { connectWebSocket } from "../../../utils/websocket"; // 引入 WebSocket 監聽

interface Pod {
  name: string;
  status: string;
}

const PodMonitoringTable = () => {
  const [pods, setPods] = useState<Pod[]>([]);
  const namespace = "default";

  useEffect(() => {
    // 建立 WebSocket 連接
    const ws = connectWebSocket(namespace, (data: any) => {
      // 假設返回的數據格式如下：{ podName: string, status: string }
      setPods(data.pods); // 更新 pod 列表
    });

    // 在組件卸載時關閉 WebSocket 連接
    return () => {
      ws.close();
    };
  }, [namespace]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Pod Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {pods.map((pod, index) => (
              <TableRow key={index}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  {pod.name}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={pod.status === "Running" ? "success" : "error"}
                  >
                    {pod.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PodMonitoringTable;