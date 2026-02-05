export interface ProjectPVC {
  id: string; // Corresponds to project-id label
  pvcName: string; // The K8s PVC Name
  projectName: string; // Human readable project name
  namespace: string; // The generated namespace (e.g., project-demo-a1b2c)
  capacity: string; // e.g., "10Gi"
  status: 'Bound' | 'Pending' | 'Lost' | 'Terminating';
  accessMode: string; // e.g., "ReadWriteMany"
  createdAt: string; // ISO Date string
  role?: string; // Project membership role (admin/manager/member)
}

export interface CreateProjectStoragePayload {
  projectId: number;
  projectName: string;
  name: string;
  capacity: number; // Size in Gi
}

export interface CreateStorageResponse {
  message: string;
  pvcName: string;
  namespace: string;
}
