export interface PVC {
  name: string;
  namespace: string;
  size: string;
  status: string;
}

export interface PVCRequest {
  name: string;
  namespace: string;
  size: string;
  storageClassName: string;
}
