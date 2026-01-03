/* eslint-disable @typescript-eslint/no-explicit-any */
import yaml from 'js-yaml';
import { createDefaultResource } from '@/features/projects/utils/resourceFactories'; // 假設既有
import {
  ResourceItem,
  ResourceKind,
  ConfigMapResource,
  ServiceResource,
  WorkloadResource,
} from '@/core/interfaces/configFile';

// 解析單個 YAML Doc 為 ResourceItem
const parseResourceDoc = (docObj: any, idx: number): ResourceItem => {
  const kind: ResourceKind = (docObj.kind as ResourceKind) || 'ConfigMap';
  const id = `parsed-${idx}-${Date.now()}`;
  const baseName = docObj.metadata?.name || `${kind.toLowerCase()}-${idx + 1}`;

  const res: ResourceItem = createDefaultResource(kind, id, baseName);
  if (docObj.metadata?.name) res.name = docObj.metadata.name;

  if (kind === 'ConfigMap') {
    const cm = res as ConfigMapResource;
    cm.data = [];
    if (docObj.data) {
      Object.entries(docObj.data).forEach(([k, v]) =>
        cm.data.push({ id: `${id}-d-${k}`, key: k, value: String(v) }),
      );
    }
    return cm;
  }

  if (kind === 'Service') {
    const svc = res as ServiceResource;
    svc.selectors = [];
    if (docObj.spec?.selector) {
      Object.entries(docObj.spec.selector).forEach(([k, v], i) =>
        svc.selectors.push({ id: `${id}-s-${i}`, key: k, value: String(v) }),
      );
    }
    svc.ports = (docObj.spec?.ports || []).map((p: any, i: number) => ({
      id: `${id}-p-${i}`,
      name: p.name || `p${i + 1}`,
      port: p.port || 0,
      targetPort: p.targetPort || p.port || 0,
      protocol: p.protocol || 'TCP',
    }));
    return svc;
  }

  if (kind === 'Pod' || kind === 'Deployment') {
    const workload = res as WorkloadResource;
    const spec = docObj.spec || {};
    // Deployment 結構不同，需找到 template spec
    const templateSpec = spec.template?.spec || spec;
    const containers = templateSpec.containers || [];

    workload.containers = containers.map((c: any, ci: number) => ({
      id: `${id}-c-${ci}`,
      name: c.name || `container-${ci + 1}`,
      image: c.image || '',
      imagePullPolicy: c.imagePullPolicy || 'IfNotPresent',
      command: c.command
        ? typeof c.command === 'string'
          ? c.command
          : JSON.stringify(c.command)
        : '',
      args: c.args ? (Array.isArray(c.args) ? JSON.stringify(c.args) : String(c.args)) : '',
      ports: (c.ports || []).map((p: any, pi: number) => ({
        id: `${id}-c-${ci}-p-${pi}`,
        port: p.containerPort || p.port || 0,
        protocol: p.protocol || 'TCP',
      })),
      env: (c.env || []).map((e: any, ei: number) => ({
        id: `${id}-c-${ci}-e-${ei}`,
        name: e.name,
        value: String(e.value),
      })),
      envFrom: (c.envFrom || []).map((ef: any) => ef.configMapRef?.name || ''),
      mounts: (c.volumeMounts || []).map((m: any, mi: number) => {
        // Find the corresponding volume definition to determine type
        const volumes = templateSpec.volumes || [];
        const volumeDef = volumes.find((v: any) => v.name === m.name);
        
        // Determine mount type based on volume definition
        let mountType: 'project-pvc' | 'user-storage' = 'project-pvc';
        let pvcName = m.name || '';
        
        if (volumeDef) {
          if (volumeDef.nfs) {
            // NFS volume - check if it's user storage placeholder
            mountType = 'user-storage';
            pvcName = ''; // NFS doesn't use PVC name
          } else if (volumeDef.persistentVolumeClaim) {
            mountType = 'project-pvc';
            pvcName = volumeDef.persistentVolumeClaim.claimName || m.name;
          }
        }
        
        return {
          id: `${id}-c-${ci}-m-${mi}`,
          mountPath: m.mountPath,
          pvcName: pvcName,
          type: mountType,
          subPath: m.subPath || '',
        };
      }),
    }));

    workload.replicas = spec.replicas || workload.replicas;

    // 解析 Labels/Selectors
    workload.selectors = [];
    const labels = spec.selector?.matchLabels || docObj.metadata?.labels || spec.selector || {};
    Object.entries(labels).forEach(([k, v], i) => {
      workload.selectors.push({ id: `${id}-s-${i}`, key: String(k), value: String(v) });
    });

    return workload;
  }

  return res;
};

export const parseK8sYaml = (yamlContent: string): ResourceItem[] => {
  try {
    const docs = yaml.loadAll(yamlContent);
    return docs.filter((d) => d && typeof d === 'object').map((doc, i) => parseResourceDoc(doc, i));
  } catch (e) {
    console.error('YAML Parse Error:', e);
    return [];
  }
};
