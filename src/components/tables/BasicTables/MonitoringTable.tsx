import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Button from "../../ui/button/Button";
import Badge from "../../ui/badge/Badge";

// Pod 資源資料結構
interface Pod {
  name: string;
  containers: string[];
  status: string;
}

interface PodMonitoringTableProps {
  namespace: string;
  pods: Pod[];
}

const PodMonitoringTable = ({ namespace, pods }: PodMonitoringTableProps) => {
  const [expandedPods, setExpandedPods] = useState<Record<string, boolean>>({});

  const handleConnectTerminal = (podName: string, container?: string) => {
    const command = "/bin/bash";
    const tty = true;
    const url = `/terminal?namespace=${encodeURIComponent(
      namespace
    )}&pod=${encodeURIComponent(podName)}&container=${container}&command=${encodeURIComponent(
      command
    )}&tty=${tty}`;
    window.open(url, "_blank");
  };

  const togglePodExpand = (podName: string) => {
    const key = `${namespace}-${podName}`;
    setExpandedPods((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* 表頭 */}
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
                Namespace
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Action
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* 表格內容 */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {pods.map((pod) => {
              const podKey = `${namespace}-${pod.name}`;
              const isExpanded = expandedPods[podKey];

              return (
                <React.Fragment key={podKey}>
                  {/* Pod row */}
                  <TableRow
                    className="cursor-pointer"
                    onClick={() => togglePodExpand(pod.name)}
                  >
                    <TableCell className="px-5 py-4 sm:px-6 text-start dark:text-gray-400">
                      {pod.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {namespace}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <Badge
                        size="sm"
                        color={pod.status === "Running" ? "success" : "error"}
                      >
                        {pod.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3">{""}</TableCell>
                  </TableRow>

                  {/* 展開後的 container rows */}
                  {isExpanded &&
                    pod.containers.map((c) => (
                      <TableRow key={`${podKey}-${c}`} className="bg-gray-50 dark:bg-white/[0.05]">
                        <TableCell className="px-5 py-2 sm:px-6 text-start dark:text-gray-400 pl-10">
                          {c}
                        </TableCell>
                        <TableCell className="px-4 py-2 text-gray-500 text-start text-theme-sm dark:text-gray-400">{""}</TableCell>
                        <TableCell className="px-4 py-2 text-gray-500 text-start text-theme-sm dark:text-gray-400">{""}</TableCell>
                        <TableCell className="px-4 py-2 text-start">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleConnectTerminal(pod.name, c);
                            }}
                          >
                            Connect
                          </Button>
                        </TableCell>
                      </TableRow>

                    ))}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PodMonitoringTable;
