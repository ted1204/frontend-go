import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Button from "../../ui/button/Button";
import Badge from "../../ui/badge/Badge";
import { WEBSOCKET_USER_MONITORING_URL } from "../../../config/url";
import { connectWebSocket } from "../../../utils/websocket";

// Pod 資源資料結構
interface Pod {
  name: string;
  containers: string[];
  status: string;
}

interface NamespacePods {
  [namespace: string]: Pod[];
}

const PodMonitoringTable = () => {
  const [podsData, setPodsData] = useState<NamespacePods>({});
  const [expandedPods, setExpandedPods] = useState<Record<string, boolean>>({});
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!wsRef.current) {
      wsRef.current = connectWebSocket(WEBSOCKET_USER_MONITORING_URL(), (data) => {
        const { kind, ns, name, status, containers } = data;
        if (kind === "Pod") {
          setPodsData((prev) => {
            const nsPods = prev[ns] || [];
            const podMap = new Map(nsPods.map(p => [p.name, p]));
            podMap.set(name, { name, containers, status });
            return { ...prev, [ns]: Array.from(podMap.values()) };
          });
        }
      });
    }

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      wsRef.current = null;
    };
  }, []);

  const handleConnectTerminal = (namespace: string, podName: string, container?: string) => {
    const command = "/bin/bash"; // 或 /bin/bash
    const tty = true;
    const url = `/terminal?namespace=${encodeURIComponent(namespace)}&pod=${encodeURIComponent(podName)}&container=${container}&command=${encodeURIComponent(command)}&tty=${tty}`;
    window.open(url, "_blank");
  };

  const togglePodExpand = (namespace: string, podName: string) => {
    const key = `${namespace}-${podName}`;
    setExpandedPods(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Pod Name</TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Namespace</TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Action</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {Object.keys(podsData).map((namespace) =>
              (podsData[namespace] || []).map((pod, index) => {
                const podKey = `${namespace}-${pod.name}`;
                const isExpanded = expandedPods[podKey];

                return (
                  <React.Fragment key={podKey}>
                    <TableRow
                      className="cursor-pointer"
                      onClick={() => togglePodExpand(namespace, pod.name)}
                    >
                      <TableCell className="px-5 py-4 sm:px-6 text-start dark:text-gray-400">{pod.name}</TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{namespace}</TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <Badge size="sm" color={pod.status === "Running" ? "success" : "error"}>{pod.status}</Badge>
                      </TableCell>
                    </TableRow>

                    {isExpanded && pod.containers.map((container) => (
                      <TableRow key={`${podKey}-${container}`} className="bg-gray-50 dark:bg-white/[0.05]">
                        <TableCell className="px-10 py-2 text-start dark:text-gray-400">{container}</TableCell>
                        <TableCell className="px-4 py-2"> </TableCell>
                        <TableCell className="px-4 py-2"> </TableCell>
                        <TableCell className="px-4 py-2 text-start">
                          <Button
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); handleConnectTerminal(namespace, pod.name, container); }}
                          >
                            Connect
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PodMonitoringTable;
