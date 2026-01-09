import {
  ResourceKind,
  ResourceItem,
  WorkloadResource,
  ServiceResource,
  ConfigMapResource,
  ContainerConfig,
} from '@/core/interfaces/configFile';

export const createDefaultContainer = (id: string, index: number): ContainerConfig => {
  return {
    id,
    name: `container-${index}`,
    image: '',
    imagePullPolicy: 'IfNotPresent',
    command: '',
    args: '',
    ports: [],
    env: [],
    envFrom: [],
    mounts: [],
  };
};

export const createDefaultResource = (
  kind: ResourceKind,
  id: string,
  baseName: string,
): ResourceItem => {
  switch (kind) {
    case 'Service':
      return {
        id,
        kind: 'Service',
        name: baseName,
        annotations: [],
        headless: false,
        serviceType: 'ClusterIP',
        ports: [{ id: `${id}-p1`, name: 'http', port: 80, targetPort: 80, protocol: 'TCP' }],
        selectors: [{ id: `${id}-s1`, key: 'app', value: baseName }],
      } as ServiceResource;

    case 'ConfigMap':
      return {
        id,
        kind: 'ConfigMap',
        name: baseName,
        annotations: [],
        data: [],
      } as ConfigMapResource;

    case 'Pod':
    case 'Deployment':
      return {
        id,
        kind: kind,
        name: baseName,
        annotations: [],
        replicas: 1,
        containers: [createDefaultContainer(`${id}-c1`, 1)],
        selectors: [{ id: `${id}-s1`, key: 'app', value: baseName }],
      } as WorkloadResource;

    default:
      throw new Error(`Unsupported resource kind: ${kind}`);
  }
};
