import { useState, useEffect } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { useTranslation } from '@nthucscc/utils';
import {
  XMarkIcon,
  CubeIcon,
  ServerStackIcon,
  GlobeAltIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

import { Project } from '../interfaces/project';
import { PVC } from '../interfaces/pvc';
import { getPVCListByProject, checkUserStorageStatus } from '../services/storageService';
import { getUsername } from '../services/authService';
import Button from './ui/button/Button';

// Imports form components
import ResourceItemForm from './configfile/ResourceItemForm';
import { FormData, ResourceItem, ResourceKind } from '../interfaces/configFile';

// Import the Generator
import { generateMultiDocYAML } from '../utils/k8sYamlGenerator';
import { createDefaultResource } from '../utils/resourceFactories';

interface AddConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: FormData) => void;
  actionLoading: boolean;
  project: Project | null;
}

export default function AddConfigModal({
  isOpen,
  onClose,
  onCreate,
  actionLoading,
  project,
}: AddConfigModalProps) {
  const { t } = useTranslation();

  // State
  const [formData, setFormData] = useState<FormData>({ filename: '', raw_yaml: '' });
  const [activeTab, setActiveTab] = useState<'wizard' | 'yaml'>('wizard');
  const [error, setError] = useState<string | null>(null);
  const [isRendered, setIsRendered] = useState(false);
  const [editorTheme, setEditorTheme] = useState('vs-light');

  // Data
  const [projectPvcs, setProjectPvcs] = useState<PVC[]>([]);
  const [hasUserStorage, setHasUserStorage] = useState(false);
  const [resources, setResources] = useState<ResourceItem[]>([]);

  // --- Add Resource Logic ---
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

  // --- Lifecycle & Data Fetching ---
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isOpen) {
      setIsRendered(true);
      setFormData({ filename: '', raw_yaml: '' });
      setResources([]);
      setError(null);
      setActiveTab('wizard');
    } else {
      timeoutId = setTimeout(() => setIsRendered(false), 300);
    }
    return () => clearTimeout(timeoutId);
  }, [isOpen]);

  useEffect(() => {
    const fetchData = async () => {
      if (isOpen && project) {
        try {
          const username = getUsername();
          const [pvcList, userStorageStatus] = await Promise.all([
            getPVCListByProject(project.PID).catch(() => []),
            username ? checkUserStorageStatus(username).catch(() => false) : Promise.resolve(false),
          ]);
          setProjectPvcs(Array.isArray(pvcList) ? pvcList : []);
          setHasUserStorage(userStorageStatus);
        } catch (err) {
          console.error('Failed to init config modal data:', err);
        }
      }
    };
    fetchData();
  }, [isOpen, project]);

  useEffect(() => {
    const updateTheme = () =>
      setEditorTheme(document.documentElement.classList.contains('dark') ? 'vs-dark' : 'vs-light');
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // --- Sync YAML on tab switch ---
  useEffect(() => {
    if (activeTab === 'yaml') {
      const generatedYaml = generateMultiDocYAML(resources);
      setFormData((prev) => ({ ...prev, raw_yaml: generatedYaml }));
    }
  }, [activeTab, resources]);

  const handleSubmit = () => {
    if (!formData.filename.trim()) {
      setError('Filename is required');
      return;
    }

    const finalYaml = activeTab === 'wizard' ? generateMultiDocYAML(resources) : formData.raw_yaml;

    if (!finalYaml.trim()) {
      setError('Config cannot be empty');
      return;
    }
    onCreate({ ...formData, raw_yaml: finalYaml });
  };

  if (!isRendered) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm ${isOpen ? 'animate-in fade-in-0' : 'animate-out fade-out-0'}`}
    >
      <div
        className={`relative flex h-full max-h-[95vh] w-full max-w-7xl flex-col rounded-xl border border-gray-200 bg-white shadow-2xl ${isOpen ? 'animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-12 duration-300' : 'animate-out fade-out-0 zoom-out-95 slide-out-to-bottom-12 duration-300'}`}
      >
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 p-4 sm:p-6 dark:border-gray-700">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('config_createTitle') || 'Create Configuration'}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage Pods, Deployments, Services, and ConfigMaps
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
              className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${activeTab === 'wizard' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:border-gray-300 dark:text-gray-400'}`}
            >
              Resource Wizard
            </button>
            <button
              onClick={() => setActiveTab('yaml')}
              className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${activeTab === 'yaml' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:border-gray-300 dark:text-gray-400'}`}
            >
              YAML Preview
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-grow space-y-6 overflow-y-auto p-4 sm:p-6 bg-gray-50/50 dark:bg-gray-900/10">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">
              {t('config_filename_label') || 'Filename'}
            </label>
            <div className="flex rounded-lg shadow-sm bg-white dark:bg-gray-800">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 sm:text-sm">
                conf/
              </span>
              <input
                type="text"
                value={formData.filename}
                placeholder="app-stack.yaml"
                className="block w-full flex-1 rounded-none rounded-r-lg border border-gray-300 px-4 py-3 text-base text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                onChange={(e) => setFormData({ ...formData, filename: e.target.value })}
              />
            </div>
          </div>

          {activeTab === 'wizard' ? (
            <div className="space-y-6">
              {/* Toolbar */}
              <div className="flex flex-wrap gap-3 p-4 rounded-xl border border-dashed border-gray-300 bg-white/50 dark:border-gray-600 dark:bg-gray-800/50 justify-center">
                <button
                  onClick={() => addResource('Pod')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 transition-all font-medium text-sm"
                >
                  <CubeIcon className="h-5 w-5" /> + Pod
                </button>
                <button
                  onClick={() => addResource('Deployment')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 transition-all font-medium text-sm"
                >
                  <ServerStackIcon className="h-5 w-5" /> + Deployment
                </button>
                <button
                  onClick={() => addResource('Service')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 transition-all font-medium text-sm"
                >
                  <GlobeAltIcon className="h-5 w-5" /> + Service
                </button>
                <button
                  onClick={() => addResource('ConfigMap')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300 transition-all font-medium text-sm"
                >
                  <DocumentTextIcon className="h-5 w-5" /> + ConfigMap
                </button>
              </div>

              {/* List */}
              <div className="space-y-4">
                {resources.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <p>No resources added.</p>
                  </div>
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
                  onChange={(val) => setFormData((prev) => ({ ...prev, raw_yaml: val }))}
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
        <div className="flex flex-col-reverse items-center gap-4 rounded-b-xl border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex-row sm:justify-between z-10">
          <div className="text-sm font-medium text-red-600 dark:text-red-400">
            {error && `Error: ${error}`}
          </div>
          <div className="flex w-full gap-3 sm:w-auto">
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={actionLoading}
              className="w-full sm:w-auto"
            >
              {actionLoading ? 'Saving...' : `Save Config (${resources.length} items)`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
