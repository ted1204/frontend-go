// Shared types for monitoring components

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
  ports?: string[];
  serviceType?: string;
  containers?: string[];
  images?: string[];
  restartCount?: number;
  metadata?: {
    deletionTimestamp?: string | null;
    creationTimestamp?: string;
    labels?: Record<string, string>;
  };
}

export type ColumnKey = 'kind' | 'name' | 'details' | 'age' | 'status' | 'images' | 'restarts' | 'labels';
