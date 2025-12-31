import { useState, useEffect } from 'react';
import { ConfigFile } from '../interfaces/configFile';
import Button from './ui/button/Button';
import { useTranslation } from '@nthucscc/utils';
import { XMarkIcon } from '@heroicons/react/24/outline';

// Import Monaco Editor
import MonacoEditor from 'react-monaco-editor';
import { generateMultiDocYAML } from '../utils/k8sYamlGenerator';
import { createDefaultResource } from '../utils/resourceFactories';
import ResourceItemForm from './configfile/ResourceItemForm';
import {
  ResourceItem,
  ResourceKind,
  ConfigMapResource,
  ServiceResource,
  WorkloadResource,
} from '../interfaces/configFile';
import { PVC } from '../interfaces/pvc';
import { getPVCListByProject, checkUserStorageStatus } from '../services/storageService';
import { getUsername } from '../services/authService';
import yaml from 'js-yaml';

interface FormData {
  filename: string;
  raw_yaml: string;
}

interface EditConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormData) => void;
  selectedConfig: ConfigFile | null;
  actionLoading: boolean;
}

export default function EditConfigModal({
  isOpen,
  onClose,
  onSave,
  selectedConfig,
  actionLoading,
}: EditConfigModalProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    filename: '',
    raw_yaml: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [editorTheme, setEditorTheme] = useState('vs-light');
  const [isRendered, setIsRendered] = useState(false);
  const [activeTab, setActiveTab] = useState<'wizard' | 'yaml'>('wizard');

  // resources similar to AddConfigModal
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [projectPvcs, setProjectPvcs] = useState<PVC[]>([]);
  const [hasUserStorage, setHasUserStorage] = useState(false);

  useEffect(() => {
    if (selectedConfig) {
      setFormData({
        filename: selectedConfig.Filename,
        raw_yaml: selectedConfig.Content,
      });
      setError(null);
    }
  }, [selectedConfig]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isOpen) {
      setIsRendered(true);
    } else {
      timeoutId = setTimeout(() => setIsRendered(false), 300);
    }
    return () => clearTimeout(timeoutId);
  }, [isOpen]);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setEditorTheme(isDarkMode ? 'vs-dark' : 'vs-light');
    const observer = new MutationObserver(() => {
      setEditorTheme(document.documentElement.classList.contains('dark') ? 'vs-dark' : 'vs-light');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  // Parse incoming YAML into resources when opening modal
  useEffect(() => {
    if (isOpen && selectedConfig && selectedConfig.Content) {
      try {
        const docs: unknown[] = yaml.loadAll(selectedConfig.Content);
        const parsed: ResourceItem[] = docs.filter(Boolean).map((doc, idx) => {
          // Defensive: fallback to empty object if not object
          const docObj =
            typeof doc === 'object' && doc !== null ? (doc as Record<string, unknown>) : {};
          const kind: ResourceKind = (docObj.kind as ResourceKind) || 'ConfigMap';
          const id = `parsed-${idx}`;
          const baseName =
            docObj.metadata &&
            typeof docObj.metadata === 'object' &&
            (docObj.metadata as Record<string, unknown>).name
              ? ((docObj.metadata as Record<string, unknown>).name as string)
              : `${kind.toLowerCase()}-${idx + 1}`;
          let res: ResourceItem = createDefaultResource(kind, id, baseName);

          // Set name if present
          if (
            docObj.metadata &&
            typeof docObj.metadata === 'object' &&
            (docObj.metadata as Record<string, unknown>).name
          ) {
            res.name = (docObj.metadata as Record<string, unknown>).name as string;
          }

          if (kind === 'ConfigMap') {
            const configMapRes = res as ConfigMapResource;
            configMapRes.data = [];
            if (docObj.data && typeof docObj.data === 'object') {
              Object.entries(docObj.data as Record<string, unknown>).forEach(([k, v]) =>
                configMapRes.data.push({ id: `${id}-d-${k}`, key: k, value: String(v) }),
              );
            }
            res = configMapRes;
          }

          if (kind === 'Service') {
            const serviceRes = res as ServiceResource;
            serviceRes.selectors = [];
            if (
              docObj.spec &&
              typeof docObj.spec === 'object' &&
              (docObj.spec as Record<string, unknown>).selector
            ) {
              Object.entries(
                (docObj.spec as { selector?: Record<string, unknown> }).selector || {},
              ).forEach(([k, v], i) =>
                serviceRes.selectors.push({ id: `${id}-s-${i}`, key: k, value: String(v) }),
              );
            }
            serviceRes.ports = [];
            const ports =
              ((docObj.spec && (docObj.spec as Record<string, unknown>).ports) as Array<
                Record<string, unknown>
              >) || [];
            ports.forEach((p, i: number) =>
              serviceRes.ports.push({
                id: `${id}-p-${i}`,
                name: (p.name as string) || `p${i + 1}`,
                port: (p.port as number) || 0,
                targetPort: (p.targetPort as number) || (p.port as number) || 0,
                protocol: (p.protocol as 'TCP' | 'UDP') || 'TCP',
              }),
            );
            res = serviceRes;
          }

          if (kind === 'Pod' || kind === 'Deployment') {
            const workloadRes = res as WorkloadResource;
            const spec = docObj.spec as Record<string, unknown>;
            const template = spec?.template as Record<string, unknown>;
            const templateSpec = template?.spec as Record<string, unknown>;
            const containers = templateSpec?.containers || spec?.containers || [];
            workloadRes.containers = (containers as Array<Record<string, unknown>>).map(
              (c, ci: number) => ({
                id: `${id}-c-${ci}`,
                name: (c.name as string) || `container-${ci + 1}`,
                image: (c.image as string) || '',
                imagePullPolicy:
                  (c.imagePullPolicy as 'Always' | 'IfNotPresent' | 'Never') || 'IfNotPresent',
                command: c.command
                  ? JSON.stringify(c.command)
                  : typeof c.command === 'string'
                    ? c.command
                    : '',
                args: c.args
                  ? Array.isArray(c.args)
                    ? JSON.stringify(c.args)
                    : String(c.args)
                  : '',
                ports: ((c.ports as Array<Record<string, unknown>>) || []).map((p, pi: number) => ({
                  id: `${id}-c-${ci}-p-${pi}`,
                  port: (p.containerPort as number) || (p.port as number) || 0,
                  protocol: (p.protocol as 'TCP' | 'UDP') || 'TCP',
                })),
                env: ((c.env as Array<Record<string, unknown>>) || []).map((e, ei: number) => ({
                  id: `${id}-c-${ci}-e-${ei}`,
                  name: e.name as string,
                  value: e.value as string,
                })),
                envFrom: ((c.envFrom as Array<Record<string, unknown>>) || []).map(
                  (ef) => ((ef.configMapRef as Record<string, unknown>)?.name as string) || '',
                ),
                mounts: ((c.volumeMounts as Array<Record<string, unknown>>) || []).map(
                  (m, mi: number) => ({
                    id: `${id}-c-${ci}-m-${mi}`,
                    mountPath: m.mountPath as string,
                    pvcName: (m.name as string) || '',
                    type: 'project-pvc',
                    subPath: '',
                  }),
                ),
              }),
            );
            workloadRes.replicas = (spec?.replicas as number) || workloadRes.replicas;
            workloadRes.selectors = [];
            const labels =
              (spec?.selector && (spec.selector as Record<string, unknown>).matchLabels) ||
              (docObj.metadata && (docObj.metadata as Record<string, unknown>).labels) ||
              (spec?.selector as Record<string, unknown>) ||
              {};
            if (labels && typeof labels === 'object') {
              let i = 0;
              Object.entries(labels).forEach(([k, v]) => {
                workloadRes.selectors.push({
                  id: `${id}-s-${i}`,
                  key: String(k),
                  value: String(v),
                });
                i += 1;
              });
            }
            res = workloadRes;
          }

          return res;
        });

        setResources(parsed);
      } catch (e) {
        console.log('Failed to parse YAML into resources:', e);
      }
    }
  }, [isOpen, selectedConfig]);

  useEffect(() => {
    const fetchData = async () => {
      if (isOpen) {
        try {
          const username = getUsername();
          const pvcList = await getPVCListByProject(0).catch(() => []);
          const userStorageStatus = username
            ? await checkUserStorageStatus(username).catch(() => false)
            : false;
          setProjectPvcs(Array.isArray(pvcList) ? pvcList : []);
          setHasUserStorage(userStorageStatus);
        } catch (err) {
          console.log('Failed to init edit modal data:', err);
        }
      }
    };
    fetchData();
  }, [isOpen]);

  const addResource = (kind: ResourceKind) => {
    const id = Date.now().toString();
    const count = resources.filter((r) => r.kind === kind).length + 1;
    const baseName = `${kind.toLowerCase()}-${count}`;
    const newResource = createDefaultResource(kind, id, baseName);
    setResources([...resources, newResource]);
  };

  const removeResource = (id: string) => {
    setResources(resources.filter((r) => r.id !== id));
  };

  const updateResource = (id: string, updated: ResourceItem) => {
    setResources(resources.map((r) => (r.id === id ? updated : r)));
  };

  const handleSubmit = () => {
    if (!formData.filename.trim()) {
      setError('檔名為必填。');
      return;
    }

    const finalYaml = activeTab === 'wizard' ? generateMultiDocYAML(resources) : formData.raw_yaml;

    if (!finalYaml.trim()) {
      setError('YAML 內容不能為空。');
      return;
    }

    setError(null);
    onSave({ ...formData, raw_yaml: finalYaml });
  };

  if (!isRendered || !selectedConfig) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm ${isOpen ? 'animate-in fade-in-0' : 'animate-out fade-out-0'}`}
    >
      <div
        className={`relative flex h-full max-h-[95vh] w-full max-w-7xl flex-col rounded-xl border border-gray-200 bg-white shadow-2xl ${
          isOpen ? 'animate-in zoom-in-95' : 'animate-out zoom-out-95'
        } dark:border-gray-700 dark:bg-gray-800`}
      >
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 p-4 sm:p-6 dark:border-gray-700">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('config_editTitle' as Parameters<typeof t>[0]) || 'Edit Configuration'}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t('config_createSubtitle' as const) || 'Use wizard or edit YAML directly.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('wizard')}
              className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
                activeTab === 'wizard'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:border-gray-300 dark:text-gray-400'
              }`}
            >
              Resource Wizard
            </button>
            <button
              onClick={() => setActiveTab('yaml')}
              className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
                activeTab === 'yaml'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:border-gray-300 dark:text-gray-400'
              }`}
            >
              YAML Preview
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-grow space-y-6 overflow-y-auto p-4 sm:p-6 bg-gray-50/50 dark:bg-gray-900/10">
          {activeTab === 'wizard' ? (
            <div className="space-y-6">
              {/* Toolbar */}
              <div className="flex flex-wrap gap-3 p-4 rounded-xl border border-dashed border-gray-300 bg-white/50 dark:border-gray-600 dark:bg-gray-800/50 justify-center">
                <button
                  onClick={() => addResource('Pod')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 transition-all font-medium text-sm"
                >
                  + Pod
                </button>
                <button
                  onClick={() => addResource('Deployment')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 transition-all font-medium text-sm"
                >
                  + Deployment
                </button>
                <button
                  onClick={() => addResource('Service')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 transition-all font-medium text-sm"
                >
                  + Service
                </button>
                <button
                  onClick={() => addResource('ConfigMap')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300 transition-all font-medium text-sm"
                >
                  + ConfigMap
                </button>
              </div>

              {/* List */}
              <div className="space-y-4">
                {resources.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">No resources added.</div>
                ) : (
                  resources.map((res, idx) => (
                    <ResourceItemForm
                      key={res.id}
                      index={idx}
                      resource={res}
                      projectPvcs={projectPvcs}
                      hasUserStorage={hasUserStorage}
                      onUpdate={updateResource}
                      onRemove={removeResource}
                    />
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in-95 duration-200">
              <div className="h-[500px] overflow-hidden rounded-lg border border-gray-300 shadow-sm dark:border-gray-600">
                <MonacoEditor
                  width="100%"
                  height="100%"
                  language="yaml"
                  theme={editorTheme}
                  value={formData.raw_yaml}
                  onChange={(newValue) => setFormData((prev) => ({ ...prev, raw_yaml: newValue }))}
                  options={{
                    minimap: { enabled: true },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-shrink-0 flex-col-reverse items-center gap-4 rounded-b-xl border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800/50 sm:flex-row sm:justify-between">
          <div className="text-sm text-red-600 dark:text-red-400">{error && `錯誤: ${error}`}</div>
          <div className="flex w-full gap-3 sm:w-auto">
            <Button variant="outline" onClick={onClose} className="w-full">
              取消
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={actionLoading}
              className="w-full"
            >
              {actionLoading ? '儲存中...' : `儲存變更`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
