export interface Resource {
  RID: number;
  CFID: number;
  Name: string;
  Type: string;
  Description?: string;
  ParsedYAML: object;
  CreatedAt: string;
}
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
    ownerReferences?: Array<{
      kind: string;
      name: string;
    }>;
  };
}
//# sourceMappingURL=resource.d.ts.map
