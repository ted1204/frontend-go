export interface ConfigFile {
  CFID: number;
  Filename: string;
  Content: string;
  ProjectID: number;
  CreatedAt: string;
}

export interface FormData {
  filename: string;
  raw_yaml: string;
}

export type MountType = 'project-pvc' | 'user-storage';
export type ResourceKind = 'Pod' | 'Deployment' | 'Service' | 'ConfigMap';
export type ImagePullPolicy = 'Always' | 'IfNotPresent' | 'Never';
export type ServiceProtocol = 'TCP' | 'UDP'; // New

export interface MountConfig {
  id: string;
  type: MountType;
  pvcName?: string;
  subPath: string;
  mountPath: string;
}

export interface EnvVar {
  id: string;
  name: string;
  value: string;
}

export interface ContainerPort {
  id: string;
  name?: string; // New: Named ports
  port: number;
  protocol: ServiceProtocol; // New
}

export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
}

export interface BaseResource {
  id: string;
  kind: ResourceKind;
  name: string;
}

// [New] Container Definition
export interface ContainerConfig {
  id: string;
  name: string;
  image: string;
  imagePullPolicy: ImagePullPolicy;
  command: string; // Supports multi-line
  args: string; // Supports multi-line
  ports: ContainerPort[];
  env: EnvVar[];
  envFrom: string[]; // List of ConfigMap names
  mounts: MountConfig[];
}

// [Updated] Workload (Supports Multiple Containers)
export interface WorkloadResource extends BaseResource {
  kind: 'Pod' | 'Deployment';
  replicas: number;
  containers: ContainerConfig[]; // Array of containers
}

export interface ServiceResource extends BaseResource {
  kind: 'Service';
  serviceType: 'ClusterIP' | 'NodePort';
  headless: boolean;
  selectors: KeyValuePair[]; // Change: Supports multiple selectors (e.g. app: my-app)
  ports: {
    id: string;
    name: string;
    port: number;
    targetPort: number;
    protocol: 'TCP' | 'UDP';
  }[];
}

export interface ConfigMapResource extends BaseResource {
  kind: 'ConfigMap';
  data: KeyValuePair[];
}

export type ResourceItem = WorkloadResource | ServiceResource | ConfigMapResource;

export interface WizardData {
  image: string;
  gpu: number;
  mounts: MountConfig[];
  command: string;
  args: string;
}
