import { useEffect, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { useTranslation } from '@nthucscc/utils'; // 假設的路徑
import { Project } from '@/core/interfaces/project';
import { PVC } from '@/core/interfaces/pvc';
import {
  getPVCListByProject,
  checkUserStorageStatus,
  getMyProjectStorages,
} from '@/core/services/storageService';
import { getUsername } from '@/core/services/authService';
import { generateMultiDocYAML } from '@/features/projects/utils/k8sYamlGenerator';

// Shared Components & Hooks
import { BaseModal } from '@nthucscc/ui';
import ResourceWizard from './configfile/ResourceWizard';
import { useConfigForm } from '@/shared/hooks/useConfigForm';

interface AddConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  // support both legacy and new prop names
  onConfirm?: (data: { filename: string; raw_yaml: string }) => void;
  onCreate?: (data: { filename: string; raw_yaml: string }) => void;
  // accept either full project or just projectId
  projectId?: number;
  project?: Project | null;
  loading?: boolean;
  actionLoading?: boolean;
}

export default function AddConfigModal({
  isOpen,
  onClose,
  onConfirm,
  onCreate,
  projectId,
  project,
  loading = false,
  actionLoading = false,
}: AddConfigModalProps) {
  const { t } = useTranslation();

  // 重複使用 hook，傳入 null 代表沒有初始 config
  const {
    filename,
    setFilename,
    rawYaml,
    setRawYaml,
    updateRawYaml,
    resources,
    setResources,
    activeTab,
    switchTab,
    error,
    setError,
  } = useConfigForm(null, isOpen);

  // 外部數據狀態
  const [projectPvcs, setProjectPvcs] = useState<PVC[]>([]);
  const [hasUserStorage, setHasUserStorage] = useState(false);
  const [editorTheme, setEditorTheme] = useState('vs-light');

  // 初始化：當 Modal 打開時重置表單
  useEffect(() => {
    if (isOpen) {
      setFilename('');
      setRawYaml('');
      setResources([]);
      setError(null);

      // 讀取外部數據
      const pid = project?.PID ?? projectId ?? 0;
      Promise.all([
        // Get PVCs for this specific project
        getPVCListByProject(pid).catch(() => []),
        // Get all project storages the user has access to
        getMyProjectStorages().catch(() => []),
        // Check user storage
        getUsername() ? checkUserStorageStatus(getUsername()!) : Promise.resolve(false),
      ]).then(([projectPvcs, allMyPvcs, storage]) => {
        // Ensure both are arrays
        const projectPvcsArray = Array.isArray(projectPvcs) ? projectPvcs : [];
        const pvcsArray = Array.isArray(allMyPvcs) ? allMyPvcs : [];

        console.log('[AddConfigModal] Project PVCs:', projectPvcsArray);
        console.log('[AddConfigModal] My Project Storages:', pvcsArray);

        // Convert ProjectPVC to PVC format and merge
        const convertedAllMyPvcs = pvcsArray
          .map(
            (proj: {
              name?: string;
              pvcName?: string;
              pvc_name?: string;
              namespace?: string;
              capacity?: string;
              Capacity?: string;
              status?: string;
            }) => {
              const name =
                proj.name ||
                proj.pvcName ||
                proj.pvc_name ||
                (proj.namespace ? `pvc-${proj.namespace}` : '');
              const size = proj.capacity || proj.Capacity || '';
              return {
                name,
                namespace: proj.namespace || '',
                size,
                status: proj.status || '',
              };
            },
          )
          .filter((pvc: { name: string }) => pvc.name);

        console.log('[AddConfigModal] Converted PVCs:', convertedAllMyPvcs);

        const merged = [
          ...projectPvcsArray.filter((p) => p.name),
          ...convertedAllMyPvcs.filter((pvc) => !projectPvcsArray.some((p) => p.name === pvc.name)),
        ];
        console.log('[AddConfigModal] Merged PVCs:', merged);
        setProjectPvcs(merged);
        setHasUserStorage(!!storage);
      });
    }
  }, [isOpen, projectId, setFilename, setRawYaml, setResources, setError, project]);

  // 處理編輯器主題
  useEffect(() => {
    const updateTheme = () =>
      setEditorTheme(document.documentElement.classList.contains('dark') ? 'vs-dark' : 'vs-light');
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const handleSubmit = () => {
    if (!filename.trim()) {
      return setError(t('config.error.filenameRequired') || '請輸入檔案名稱');
    }

    const finalYaml = activeTab === 'wizard' ? generateMultiDocYAML(resources) : rawYaml;

    if (!finalYaml.trim()) {
      return setError(t('config.error.yamlEmpty') || '內容不能為空');
    }

    const cb = onConfirm ?? onCreate;
    if (cb) cb({ filename, raw_yaml: finalYaml });
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('config.createTitle') || '新增設定檔'}
      subtitle={t('config.createSubtitle') || '使用精靈模式或直接編寫 YAML'}
      maxWidth="max-w-7xl"
    >
      <div className="flex flex-col h-[75vh]">
        {/* 檔名輸入區 (新增模式特有) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('config.filename.label') || '檔案名稱'} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="example-config.yaml"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm py-2 px-3"
          />
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-4 flex-shrink-0">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => switchTab('wizard')}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'wizard'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              Resource Wizard
            </button>
            <button
              onClick={() => switchTab('yaml')}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'yaml'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              YAML Preview
            </button>
          </nav>
        </div>

        {/* Content Area - 自動填滿剩餘高度 */}
        <div className="flex-grow overflow-hidden relative">
          {activeTab === 'wizard' ? (
            <div className="h-full overflow-y-auto pr-2">
              <ResourceWizard
                resources={resources}
                setResources={setResources}
                projectPvcs={projectPvcs}
                hasUserStorage={hasUserStorage}
              />
            </div>
          ) : (
            <div className="h-full border border-gray-300 rounded-lg overflow-hidden dark:border-gray-600">
              <MonacoEditor
                width="100%"
                height="100%"
                language="yaml"
                theme={editorTheme}
                value={rawYaml}
                onChange={updateRawYaml}
                options={{
                  minimap: { enabled: true },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  wordWrap: 'on',
                }}
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4 flex-shrink-0">
          <span className="text-sm text-red-600 dark:text-red-400 font-medium">
            {error && `錯誤: ${error}`}
          </span>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              {t('common.cancel') || '取消'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || actionLoading}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:opacity-50 transition-colors shadow-sm"
            >
              {loading || actionLoading
                ? t('config.creating') || '建立中...'
                : t('common.create') || '建立'}
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
