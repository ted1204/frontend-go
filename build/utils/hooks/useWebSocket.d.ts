export interface ResourceMessage {
    type: string;
    name: string;
    ns: string;
    status?: string;
    kind?: string;
    age?: string;
    clusterIP?: string;
    externalIP?: string;
    externalIPs?: string[];
    nodePorts?: number[];
    serviceType?: string;
    containers?: string[];
    metadata?: {
        deletionTimestamp?: string | null;
        creationTimestamp?: string;
        labels?: Record<string, string>;
    };
}
export default function useWebSocket(): ResourceMessage[];
//# sourceMappingURL=useWebSocket.d.ts.map