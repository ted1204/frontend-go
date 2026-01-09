import {
  ResourceItem,
  WorkloadResource,
  ServiceResource,
  ConfigMapResource,
} from '@/core/interfaces/configFile';

export const generateMultiDocYAML = (resources: ResourceItem[]): string => {
  if (resources.length === 0) return '';

  const docs = resources.map((res) => {
    let yaml = `apiVersion: v1
kind: ${res.kind}
metadata:
  name: ${res.name}
`;

    // Emit metadata.annotations if present
    if ('annotations' in res && res.annotations && res.annotations.length > 0) {
      yaml += `  annotations:\n`;
      res.annotations.forEach((a) => {
        yaml += `    ${a.key}: "${String(a.value).replace(/"/g, '\\"')}"\n`;
      });
    }

    // --- WORKLOADS (Pod / Deployment) ---
    if (res.kind === 'Pod' || res.kind === 'Deployment') {
      const wl = res as WorkloadResource;
      const isDeploy = res.kind === 'Deployment';
      // Deployment spec is at a deeper level, different indentation
      const indent = isDeploy ? '        ' : '    ';
      // Helper to serialize selectors into label blocks
      const serializeLabels = (
        selectors: { id?: string; key?: string; value?: string }[] | undefined,
        prefix: string,
      ) => {
        if (!selectors || selectors.length === 0) {
          return `${prefix}labels:\n${prefix}  app: ${res.name}\n`;
        }
        let s = `${prefix}labels:\n`;
        selectors.forEach((sel) => {
          if (sel.key) s += `${prefix}  ${sel.key}: ${sel.value}\n`;
        });
        return s;
      };

      // 1. Header & Spec Structure
      if (isDeploy) {
        yaml = `apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: ${res.name}\n`;
        // Deployment metadata annotations (if provided)
        if ('annotations' in res && res.annotations && res.annotations.length > 0) {
          yaml += `  annotations:\n`;
          res.annotations.forEach((a) => {
            yaml += `    ${a.key}: "${String(a.value).replace(/"/g, '\\"')}"\n`;
          });
        }
        // metadata.labels
        yaml += serializeLabels(wl.selectors, '  ');
        yaml += `spec:\n  replicas: ${wl.replicas || 1}\n  selector:\n    matchLabels:\n`;
        // selector.matchLabels (indent deeper)
        yaml += serializeLabels(wl.selectors, '  ').replace(/labels:\n/, '');
        yaml += `  template:\n    metadata:\n`;
        // If annotations exist, emit them under the Pod template metadata as well
        if ('annotations' in res && res.annotations && res.annotations.length > 0) {
          yaml += `      annotations:\n`;
          res.annotations.forEach((a) => {
            yaml += `        ${a.key}: "${String(a.value).replace(/"/g, '\\"')}"\n`;
          });
        }
        // template.metadata.labels
        yaml += serializeLabels(wl.selectors, '      ');
        yaml += `    spec:\n`;
      } else {
        // Pod header + metadata.labels
        yaml += serializeLabels(wl.selectors, '  ');
        yaml += `spec:\n`;
      }

      // 2. Containers Loop
      const containersHeader = isDeploy ? `      containers:\n` : `  containers:\n`;
      yaml += containersHeader;

      // Collect all Container Mounts (expanded per-subpath), define Volumes at Pod Level later
      type VolumeMountEntry = {
        id?: string;
        type: 'user-storage' | 'project-pvc' | string;
        pvcName?: string;
        mountPath: string;
        subPath?: string;
      };
      const allMounts: VolumeMountEntry[] = [];

      wl.containers.forEach((c) => {
        yaml += `${indent}- name: ${c.name}
${indent}  image: "${c.image || 'ubuntu:latest'}"
${indent}  imagePullPolicy: ${c.imagePullPolicy}
`;
        // Command (handle JSON array string or plain text)
        if (c.command) {
          const cmdStr = c.command.trim().startsWith('[') ? c.command : `["${c.command}"]`;
          yaml += `${indent}  command: ${cmdStr}\n`;
        }

        // Args (handle multiline text -> multiple list entries, or JSON array)
        if (c.args) {
          if (c.args.includes('\n')) {
            const lines = c.args.split('\n');
            yaml += `${indent}  args:\n`;
            yaml += `${indent}    - |\n`;
            lines.forEach((ln) => {
              yaml += `${indent}      ${ln}\n`;
            });
          } else if (c.args.trim().startsWith('[')) {
            yaml += `${indent}  args: ${c.args}\n`;
          } else {
            const escaped = c.args.replace(/"/g, '\\"');
            yaml += `${indent}  args: ["${escaped}"]\n`;
          }
        }

        // Ports
        if (c.ports.length > 0) {
          yaml += `${indent}  ports:\n`;
          c.ports.forEach((p) => {
            yaml += `${indent}    - containerPort: ${p.port}\n`;
            if (p.protocol !== 'TCP') yaml += `${indent}      protocol: ${p.protocol}\n`;
          });
        }

        // Resources (CPU, Memory, GPU)
        if (c.resources) {
          const hasRequests =
            c.resources.requests?.cpu || c.resources.requests?.memory || c.resources.requests?.gpu;
          const hasLimits =
            c.resources.limits?.cpu || c.resources.limits?.memory || c.resources.limits?.gpu;

          if (hasRequests || hasLimits) {
            yaml += `${indent}  resources:\n`;

            if (hasRequests) {
              yaml += `${indent}    requests:\n`;
              if (c.resources.requests?.cpu) {
                yaml += `${indent}      cpu: "${c.resources.requests.cpu}"\n`;
              }
              if (c.resources.requests?.memory) {
                yaml += `${indent}      memory: "${c.resources.requests.memory}"\n`;
              }
              if (c.resources.requests?.gpu) {
                yaml += `${indent}      nvidia.com/gpu: "${c.resources.requests.gpu}"\n`;
              }
            }

            if (hasLimits) {
              yaml += `${indent}    limits:\n`;
              if (c.resources.limits?.cpu) {
                yaml += `${indent}      cpu: "${c.resources.limits.cpu}"\n`;
              }
              if (c.resources.limits?.memory) {
                yaml += `${indent}      memory: "${c.resources.limits.memory}"\n`;
              }
              if (c.resources.limits?.gpu) {
                yaml += `${indent}      nvidia.com/gpu: "${c.resources.limits.gpu}"\n`;
              }
            }
          }
        }

        // Env
        if (c.env.length > 0) {
          yaml += `${indent}  env:\n`;
          c.env.forEach((e) => {
            yaml += `${indent}    - name: ${e.name}\n${indent}      value: "${e.value}"\n`;
          });
        }

        // EnvFrom (ConfigMap Refs)
        if (c.envFrom.length > 0) {
          yaml += `${indent}  envFrom:\n`;
          c.envFrom.forEach((cmName) => {
            yaml += `${indent}    - configMapRef:\n${indent}        name: ${cmName}\n`;
          });
        }

        // Volume Mounts (Container Level) - support multiple subPaths per MountConfig
        if (c.mounts.length > 0) {
          yaml += `${indent}  volumeMounts:\n`;
          c.mounts.forEach((m) => {
            const volName =
              m.type === 'user-storage'
                ? 'user-home'
                : (m.pvcName || 'vol').replace(/[^a-z0-9-]/g, '-').toLowerCase();

            (m.subPaths || []).forEach((sp) => {
              // push an entry describing this specific mount-subpath
              allMounts.push({ ...m, mountPath: sp.mountPath, subPath: sp.subPath });
              yaml += `${indent}    - name: ${volName}\n${indent}      mountPath: ${sp.mountPath}\n`;
              if (sp.subPath) {
                yaml += `${indent}      subPath: ${sp.subPath}\n`;
              }
            });
          });
        }
      });

      // 3. Volumes Definition (Pod Level) - Remove duplicates
      if (allMounts.length > 0) {
        const volumesHeader = isDeploy ? `      volumes:\n` : `  volumes:\n`;
        const volItemPrefix = isDeploy ? `        ` : `    `;
        const volInnerPrefix = isDeploy ? `          ` : `      `;
        const volInnerInner = isDeploy ? `            ` : `        `;

        yaml += volumesHeader;
        const uniqueVols = new Set<string>();

        allMounts.forEach((m) => {
          const volName =
            m.type === 'user-storage'
              ? 'user-home'
              : (m.pvcName || 'vol').replace(/[^a-z0-9-]/g, '-').toLowerCase();

          if (uniqueVols.has(volName)) return; // Skip duplicates
          uniqueVols.add(volName);

          yaml += `${volItemPrefix}- name: ${volName}\n`;
          if (m.type === 'user-storage') {
            yaml += `${volInnerPrefix}nfs:\n${volInnerInner}server: "{{nfsServer}}"\n${volInnerInner}path: /\n`;
          } else {
            // Project storage: use project NFS server with root path
            yaml += `${volInnerPrefix}nfs:\n${volInnerInner}server: "{{projectNfsServer}}"\n${volInnerInner}path: /\n`;
          }
        });
      }
    }
    // --- SERVICE ---
    else if (res.kind === 'Service') {
      const svc = res as ServiceResource;
      yaml += `spec:\n`;
      // Service Type (ClusterIP / NodePort)
      if (svc.serviceType) {
        yaml += `  type: ${svc.serviceType}\n`;
      }
      if (svc.headless) {
        yaml += `  clusterIP: None\n`;
      }
      yaml += `  selector:\n`;
      // Generate selectors (key: value)
      if (svc.selectors && svc.selectors.length > 0) {
        svc.selectors.forEach((s) => {
          if (s.key && s.value) {
            yaml += `    ${s.key}: ${s.value}\n`;
          }
        });
      } else {
        // Fallback or empty (User removed all selectors)
        // Kubernetes allows empty selectors (it won't select anything)
        yaml += `    # No selector defined (Manual Endpoint)\n`;
      }

      yaml += `  ports:\n`;

      if (svc.ports.length === 0) {
        yaml += `    # No ports defined\n`;
      } else {
        svc.ports.forEach((p) => {
          yaml += `    - name: ${p.name}\n      port: ${p.port}\n      targetPort: ${p.targetPort}\n      protocol: ${p.protocol}\n`;
        });
      }
    }
    // --- CONFIGMAP ---
    else if (res.kind === 'ConfigMap') {
      const cm = res as ConfigMapResource;
      yaml += `data:\n`;
      if (cm.data.length === 0) {
        yaml += `  # No data added\n`;
      } else {
        cm.data.forEach((pair) => {
          if (pair.key) yaml += `  ${pair.key}: "${pair.value}"\n`;
        });
      }
    }

    return yaml;
  });

  return docs.join('\n---\n\n');
};
