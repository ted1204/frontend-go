// types.ts
export interface Pod {
  name: string;
  containers: string[];
  status: string;
}

export interface NamespacePods {
  [namespace: string]: Pod[];
}

// Helper type to fix the "key" strict typing issue in sub-components
export type TranslateFn = (key: any) => string;
