import { useState, useEffect } from 'react';
import { ConfigFile } from '../interfaces/configFile';
import Button from './ui/button/Button';

// Import Monaco Editor
import MonacoEditor from 'react-monaco-editor';

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
  const [formData, setFormData] = useState<FormData>({
    filename: '',
    raw_yaml: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [editorTheme, setEditorTheme] = useState('vs-light');

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

  const handleSubmit = () => {
    if (!formData.filename.trim()) {
      setError('檔名為必填。');
      return;
    }
    if (!formData.raw_yaml.trim()) {
      setError('YAML 內容不能為空。');
      return;
    }
    setError(null);
    onSave(formData);
  };

  if (!isOpen || !selectedConfig) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in-0">
      {/* Modal is now significantly wider for a better editing experience */}
      <div className="relative flex h-full max-h-[95vh] w-full max-w-7xl flex-col rounded-xl border border-gray-200 bg-white shadow-2xl animate-in zoom-in-95 dark:border-gray-700 dark:bg-gray-800">
        {/* Modal Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 p-4 sm:p-6 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            編輯:{' '}
            <span className="font-mono text-blue-600 dark:text-blue-400">{formData.filename}</span>
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body (scrollable) */}
        <div className="flex-grow space-y-6 overflow-y-auto p-4 sm:p-6">
          {/* A refined grid layout for the filename field to solve the "crowded" issue */}
          <div className="space-y-2">
            <label
              htmlFor="filename"
              className="block text-sm font-bold text-gray-800 dark:text-gray-200"
            >
              設定檔名稱
            </label>
            <div className="flex rounded-lg shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 sm:text-sm">
                檔名:
              </span>
              <input
                id="filename"
                type="text"
                value={formData.filename}
                placeholder="my-deployment.yaml"
                className="
                    block w-full flex-1 rounded-none rounded-r-lg   // Shape for grouping
                    border border-gray-300 px-4 py-3 text-base        // Size and border
                    text-gray-900 placeholder:text-gray-400         // Colors
                    focus:border-blue-500 focus:ring-blue-500       // Focus state
                    dark:border-gray-600 dark:bg-gray-900 dark:text-white
                    dark:focus:border-blue-500 dark:focus:ring-blue-500
                  "
                onChange={(e) => setFormData({ ...formData, filename: e.target.value })}
              />
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              必須是唯一的名稱，且以 .yaml 或 .yml 結尾。
            </p>
          </div>
          {/* Monaco Editor for YAML content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              YAML 內容
            </label>
            <div className="editor-container mt-2 h-[450px] rounded-lg border border-gray-300 p-px shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 dark:border-gray-600">
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
        </div>

        {/* Modal Footer */}
        <div className="flex flex-shrink-0 flex-col-reverse items-center gap-4 rounded-b-xl border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50 sm:flex-row sm:justify-between">
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
              {actionLoading ? '儲存中...' : '儲存變更'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
