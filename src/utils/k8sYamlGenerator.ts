import {
  ResourceItem,
  WorkloadResource,
  ServiceResource,
  ConfigMapResource,
  MountConfig,
} from '../interfaces/configFile';

export const generateMultiDocYAML = (resources: ResourceItem[]): string => {
  if (resources.length === 0) return '';

  const docs = resources.map((res) => {
    let yaml = `apiVersion: v1
kind: ${res.kind}
metadata:
  name: ${res.name}
  labels:
    app: ${res.name}
`;

    // --- WORKLOADS (Pod / Deployment) ---
    if (res.kind === 'Pod' || res.kind === 'Deployment') {
      const wl = res as WorkloadResource;
      const isDeploy = res.kind === 'Deployment';
      // Deployment 的 spec 在比較深層，縮排不同
      const indent = isDeploy ? '        ' : '    ';

      // 1. Header & Spec Structure
      if (isDeploy) {
        yaml = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${res.name}
  labels:
    app: ${res.name}
spec:
  replicas: ${wl.replicas || 1}
  selector:
    matchLabels:
      app: ${res.name}
  template:
    metadata:
      labels:
        app: ${res.name}
    spec:
`;
      } else {
        yaml += `spec:
`;
      }

      // 2. Containers Loop
      yaml += `      containers:\n`;

      // 用來收集所有 Container 的 Mounts，最後在 Pod Level 定義 Volumes
      const allMounts: MountConfig[] = [];

      wl.containers.forEach((c) => {
        yaml += `${indent}- name: ${c.name}
${indent}  image: "${c.image || 'ubuntu:latest'}"
${indent}  imagePullPolicy: ${c.imagePullPolicy}
`;
        // Command (處理 JSON array 字串或一般文字)
        if (c.command) {
          const cmdStr = c.command.trim().startsWith('[') ? c.command : `["${c.command}"]`;
          yaml += `${indent}  command: ${cmdStr}\n`;
        }

        // Args (處理多行文字區塊 | 或 JSON array)
        if (c.args) {
          if (c.args.includes('\n')) {
            // Multiline block scalar
            const indentedArgs = c.args
              .split('\n')
              .map((line) => `${indent}    ${line}`)
              .join('\n');
            yaml += `${indent}  args:\n${indent}    - |\n${indentedArgs}\n`;
          } else if (c.args.trim().startsWith('[')) {
            yaml += `${indent}  args: ${c.args}\n`;
          } else {
            yaml += `${indent}  args: ["${c.args}"]\n`;
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

        // Volume Mounts (Container Level)
        if (c.mounts.length > 0) {
          yaml += `${indent}  volumeMounts:\n`;
          c.mounts.forEach((m) => {
            allMounts.push(m);
            // 決定 Volume 名稱：如果是 user-storage 給固定名稱，project storage 用 PVC 名稱
            const volName = m.type === 'user-storage' ? 'user-home' : m.pvcName || 'vol';
            yaml += `${indent}    - name: ${volName}\n${indent}      mountPath: ${m.mountPath}\n`;
          });
        }
      });

      // 3. Volumes Definition (Pod Level) - 去除重複
      if (allMounts.length > 0) {
        yaml += `      volumes:\n`;
        const uniqueVols = new Set<string>();

        allMounts.forEach((m) => {
          const volName = m.type === 'user-storage' ? 'user-home' : m.pvcName || 'vol';

          if (uniqueVols.has(volName)) return; // Skip duplicates
          uniqueVols.add(volName);

          yaml += `        - name: ${volName}\n`;
          if (m.type === 'user-storage') {
            yaml += `          nfs:\n            server: storage-svc.user-{{username}}-storage.svc.cluster.local\n            path: /\n`;
          } else {
            yaml += `          persistentVolumeClaim:\n            claimName: ${m.pvcName}\n`;
          }
        });
      }
    }
    // --- SERVICE ---
    else if (res.kind === 'Service') {
      const svc = res as ServiceResource;
      yaml += `spec:\n`;
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
