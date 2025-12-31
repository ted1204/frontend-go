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
  images?: string[]; // [New]
  restartCount?: number; // [New]
  metadata?: {
    deletionTimestamp?: string | null;
    creationTimestamp?: string;
    labels?: Record<string, string>; // [New]
  };
}

// Placeholder: the real implementation lives in the app.
// This file provides the type and a lightweight default for package builds.
export default function useWebSocket(): ResourceMessage[] {
  return [];
}
