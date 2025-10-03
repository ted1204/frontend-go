import { useEffect, useRef, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import PodMonitoringTable from "../../components/tables/BasicTables/MonitoringTable";
import { WEBSOCKET_USER_MONITORING_URL } from "../../config/url";
import { connectWebSocket } from "../../utils/websocket";

// Pod 型別
interface Pod {
  name: string;
  containers: string[];
  status: string;
}

// namespace → pods 的 map
interface NamespacePods {
  [namespace: string]: Pod[];
}

export default function PodTables() {
  const [podsData, setPodsData] = useState<NamespacePods>({});
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!wsRef.current) {
      wsRef.current = connectWebSocket(
        WEBSOCKET_USER_MONITORING_URL(),
        (data) => {
          if (data.kind === "Pod") {
            setPodsData((prev) => {
              const nsPods = prev[data.ns] || [];
              const podMap = new Map(nsPods.map((p) => [p.name, p]));
              podMap.set(data.name, {
                name: data.name,
                containers: data.containers,
                status: data.status,
              });
              return { ...prev, [data.ns]: Array.from(podMap.values()) };
            });
          }
        }
      );
    }

    return () => {
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, []);

  return (
    <>
      <PageMeta title="Pods Dashboard" description="Monitor Pods by namespace" />
      <PageBreadcrumb pageTitle="Containers" />
      <div className="space-y-6">
        {Object.keys(podsData).map((ns) => (
          <ComponentCard key={ns} title={`Namespace: ${ns}`}>
            <PodMonitoringTable namespace={ns} pods={podsData[ns]} />
          </ComponentCard>
        ))}
      </div>
    </>
  );
}
