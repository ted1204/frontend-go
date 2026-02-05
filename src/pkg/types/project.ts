export interface Project {
  PID: number;
  ProjectName: string;
  Description?: string;
  GID: number;
  GPUQuota: number;
  GPUAccess: string;
  MPSLimit?: number;
  MPSMemory?: number;
  CreatedAt: string;
  UpdatedAt: string;
  Storages?: { name: string; capacity?: string; status?: string }[];
}
