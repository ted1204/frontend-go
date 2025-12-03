import React, { useState, useEffect } from 'react';
import Button from './ui/button/Button';

// Import Monaco Editor and its assets
import MonacoEditor from 'react-monaco-editor';

interface FormData {
  filename: string;
  raw_yaml: string;
}

interface AddConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: FormData) => void;
  actionLoading: boolean;
}

export default function AddConfigModal({
  isOpen,
  onClose,
  onCreate,
  actionLoading,
}: AddConfigModalProps) {
  const [formData, setFormData] = useState<FormData>({
    filename: '',
    raw_yaml: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [editorTheme, setEditorTheme] = useState('vs-light');

  //  1. State to control the modal's presence in the DOM for animations
  const [isRendered, setIsRendered] = useState(false);

  //  2. useEffect hook to coordinate the enter and exit animations
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isOpen) {
      // If opening, immediately render the component to play the enter animation
      setIsRendered(true);
      setFormData({ filename: '', raw_yaml: '' });
      setError(null);
    } else {
      // If closing, wait for the animation to finish (e.g., 300ms) before unmounting
      timeoutId = setTimeout(() => setIsRendered(false), 300);
    }

    // Cleanup the timeout if the component unmounts or isOpen changes again
    return () => clearTimeout(timeoutId);
  }, [isOpen]);

  // Effect to dynamically set the editor's theme based on light/dark mode
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setEditorTheme(isDarkMode ? 'vs-dark' : 'vs-light');
    const observer = new MutationObserver(() => {
      setEditorTheme(
        document.documentElement.classList.contains('dark')
          ? 'vs-dark'
          : 'vs-light'
      );
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  const handleSubmit = () => {
    // Validation logic remains the same
    if (!formData.filename.trim()) {
      setError('Filename is required.');
      return;
    }
    if (
      !formData.filename.endsWith('.yaml') &&
      !formData.filename.endsWith('.yml')
    ) {
      setError('Filename must end with .yaml or .yml');
      return;
    }
    if (!formData.raw_yaml.trim()) {
      setError('YAML content cannot be empty.');
      return;
    }
    setError(null);
    onCreate(formData);
  };

  //  3. Use isRendered to control the final return
  if (!isRendered) return null;

  return (
    //  4. Conditionally apply enter/exit animation classes based on the isOpen prop
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm 
                 ${isOpen ? 'animate-in fade-in-0' : 'animate-out fade-out-0'}`}
    >
      <div
        className={`relative flex h-full max-h-[95vh] w-full max-w-7xl flex-col rounded-xl border border-gray-200 bg-white shadow-2xl 
                       ${
                         isOpen
                           ? 'animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-12 duration-300'
                           : 'animate-out fade-out-0 zoom-out-95 slide-out-to-bottom-12 duration-300'
                       }`}
      >
        {/* Modal Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 p-4 sm:p-6 dark:border-gray-700">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Create New Config File
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Enter a filename and paste your YAML content below.
            </p>
          </div>
          <button
            onClick={onClose} // The close button now triggers the exit animation
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body (scrollable) */}
        <div className="flex-grow space-y-8 overflow-y-auto p-4 sm:p-6">
          {/* Filename Input Group */}
          <div className="space-y-2">
            <label
              htmlFor="filename"
              className="block text-sm font-bold text-gray-800 dark:text-gray-200"
            >
              Configuration Filename
            </label>
            <div className="flex rounded-lg shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 sm:text-sm">
                filename:
              </span>
              <input
                id="filename"
                type="text"
                value={formData.filename}
                placeholder="my-new-deployment.yaml"
                className="block w-full flex-1 rounded-none rounded-r-lg border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
                onChange={(e) =>
                  setFormData({ ...formData, filename: e.target.value })
                }
              />
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Must be a unique name ending with .yaml or .yml.
            </p>
          </div>

          {/* Monaco Editor */}
          <div>
            <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">
              YAML Content
            </label>
            <div className="editor-container mt-2 h-[450px] rounded-lg border border-gray-300 p-px shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 dark:border-gray-600">
              <MonacoEditor
                width="100%"
                height="100%"
                language="yaml"
                theme={editorTheme}
                value={formData.raw_yaml}
                onChange={(newValue) =>
                  setFormData((prev) => ({ ...prev, raw_yaml: newValue }))
                }
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
          <div className="text-sm text-red-600 dark:text-red-400">
            {error && `Error: ${error}`}
          </div>
          <div className="flex w-full gap-3 sm:w-auto">
            <Button variant="outline" onClick={onClose} className="w-full">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={actionLoading}
              className="w-full"
            >
              {actionLoading ? 'Creating...' : 'Create Config File'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
