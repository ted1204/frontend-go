import { useEffect, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { useTranslation } from '@nthucscc/utils';
import { ConfigFile } from '@/core/interfaces/configFile';
import { getPVCListByProject, checkUserStorageStatus, getMyProjectStorages } from '@/core/services/storageService';
import { getUsername } from '@/core/services/authService';
import { generateMultiDocYAML } from '@/features/projects/utils/k8sYamlGenerator';

// Refactored Imports
import { BaseModal } from '@nthucscc/ui';
import ResourceWizard from './configfile/ResourceWizard';
import { useConfigForm } from '@/shared/hooks/useConfigForm';
import { PVC } from '@/core/interfaces/pvc';

interface EditConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { filename: string; raw_yaml: string }) => void;
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

  // Custom Hook managing synchronization and state
  const {
    filename,
    rawYaml,
    updateRawYaml,
    resources,
    setResources,
    activeTab,
    switchTab,
    error,
    setError,
  } = useConfigForm(selectedConfig, isOpen);

  // External Data State
  const [projectPvcs, setProjectPvcs] = useState<PVC[]>([]);
  const [hasUserStorage, setHasUserStorage] = useState(false);
  const [editorTheme, setEditorTheme] = useState('vs-light');

  // Load external data
  useEffect(() => {
    if (isOpen && selectedConfig) {
      Promise.all([
        // Get PVCs for this specific project
        getPVCListByProject(selectedConfig.ProjectID).catch(() => []),
        // Get all project storages the user has access to
        getMyProjectStorages().catch(() => []),
        // Check user storage
        getUsername() ? checkUserStorageStatus(getUsername()!) : Promise.resolve(false),
      ]).then(([projectPvcs, allMyPvcs, storage]) => {
        // Ensure both are arrays
        const projectPvcsArray = Array.isArray(projectPvcs) ? projectPvcs : [];
        const pvcsArray = Array.isArray(allMyPvcs) ? allMyPvcs : [];
        
        console.log('[EditConfigModal] Project PVCs:', projectPvcsArray);
        console.log('[EditConfigModal] My Project Storages:', pvcsArray);
        
        // Convert ProjectPVC to PVC format and merge
        const convertedAllMyPvcs = pvcsArray.map((proj: { name?: string; pvcName?: string; namespace?: string; capacity?: string; Capacity?: string; status?: string }) => ({
          name: proj.name || proj.pvcName,
          namespace: proj.namespace,
          size: proj.capacity || proj.Capacity,
          status: proj.status,
        }));
        
        console.log('[EditConfigModal] Converted PVCs:', convertedAllMyPvcs);
        
        const merged = [
          ...projectPvcsArray,
          ...convertedAllMyPvcs.filter(pvc => !projectPvcsArray.some(p => p.name === pvc.name))
        ];
        console.log('[EditConfigModal] Merged PVCs:', merged);
        setProjectPvcs(merged);
        setHasUserStorage(!!storage);
      });
    }
  }, [isOpen, selectedConfig]);

  // Handle Theme
  useEffect(() => {
    const updateTheme = () =>
      setEditorTheme(document.documentElement.classList.contains('dark') ? 'vs-dark' : 'vs-light');
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const handleSave = () => {
    if (!filename.trim()) return setError('檔名為必填。');

    // Ensure we send the latest data regardless of current tab
    const finalYaml = activeTab === 'wizard' ? generateMultiDocYAML(resources) : rawYaml;

    if (!finalYaml.trim()) return setError('YAML 內容不能為空。');
    onSave({ filename, raw_yaml: finalYaml });
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('config.createTitle') || 'Edit Configuration'}
      subtitle={t('config.createSubtitle') || 'Use wizard or edit YAML directly.'}
      maxWidth="max-w-7xl"
    >
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => switchTab('wizard')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'wizard'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Resource Wizard
          </button>
          <button
            onClick={() => switchTab('yaml')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'yaml'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            YAML Preview
          </button>
        </nav>
      </div>

      {/* Content Area */}
      <div className="h-[60vh] overflow-y-auto mb-6">
        {activeTab === 'wizard' ? (
          <ResourceWizard
            resources={resources}
            setResources={setResources}
            projectPvcs={projectPvcs}
            hasUserStorage={hasUserStorage}
          />
        ) : (
          <div className="h-full border border-gray-300 rounded-lg overflow-hidden dark:border-gray-600">
            <MonacoEditor
              width="100%"
              height="100%"
              language="yaml"
              theme={editorTheme}
              value={rawYaml}
              onChange={updateRawYaml}
              options={{ minimap: { enabled: true }, scrollBeyondLastLine: false, fontSize: 14 }}
            />
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <span className="text-sm text-red-600 dark:text-red-400">{error && `錯誤: ${error}`}</span>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 border rounded-md hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={actionLoading}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:opacity-50"
          >
            {actionLoading ? '儲存中...' : '儲存變更'}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
