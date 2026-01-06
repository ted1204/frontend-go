import React, { useState, FormEvent, useEffect } from 'react';
import { getAllowedImages, AllowedImage } from '@/core/services/imageService';
import { SubmitJobRequest } from '@/core/services/jobSubmitService';

interface JobApplyModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SubmitJobRequest) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: string | null;
}

const JobApplyModal: React.FC<JobApplyModalProps> = ({
  open,
  onClose,
  onSubmit,
  loading,
  error,
  success,
}) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [namespace, setNamespace] = useState('default');
  const [priority, setPriority] = useState('normal');
  const [cpu, setCpu] = useState('');
  const [memory, setMemory] = useState('');
  const [gpuCount, setGpuCount] = useState(0);
  const [command, setCommand] = useState('');
  const [allowedImages, setAllowedImages] = useState<AllowedImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);

  useEffect(() => {
    if (open) {
      loadAllowedImages();
    }
  }, [open]);

  const loadAllowedImages = async () => {
    setLoadingImages(true);
    try {
      const images = await getAllowedImages();
      setAllowedImages(images);
    } catch (err) {
      console.error('Failed to load allowed images:', err);
    } finally {
      setLoadingImages(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload: SubmitJobRequest = {
      name,
      image,
      namespace,
      priority,
      cpu_request: cpu || undefined,
      memory_request: memory || undefined,
      gpu_count: gpuCount > 0 ? gpuCount : undefined,
      command: command ? command.split(' ') : undefined,
    };
    await onSubmit(payload);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl p-6 relative flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Submit New Job
          </h2>
          <button
            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            onClick={onClose}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 pr-2">
          {error && (
            <div className="mb-4 p-3 rounded bg-red-50 text-red-600 text-sm border border-red-100 flex items-start gap-2">
              <svg
                className="w-5 h-5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded bg-green-50 text-green-600 text-sm border border-green-100 flex items-start gap-2">
              <svg
                className="w-5 h-5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section: Basic Info */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                Basic Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-full md:col-span-1">
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                    Job Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow sm:text-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="my-job-123"
                    required
                  />
                </div>

                <div className="col-span-full md:col-span-1">
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                    Namespace <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow sm:text-sm"
                    value={namespace}
                    onChange={(e) => setNamespace(e.target.value)}
                    required
                  />
                </div>

                <div className="col-span-full">
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                    Container Image <span className="text-red-500">*</span>
                  </label>
                  {loadingImages ? (
                    <div className="animate-pulse h-10 bg-gray-100 dark:bg-gray-800 rounded-md"></div>
                  ) : allowedImages.length > 0 ? (
                    <div className="relative">
                      <select
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow appearance-none sm:text-sm"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        required
                      >
                        <option value="">Select an image...</option>
                        {allowedImages.map((img) => (
                          <option key={img.ID} value={`${img.Name}:${img.Tag}`}>
                            {img.Name}:{img.Tag}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="e.g., ubuntu:22.04"
                        required
                      />
                      <p className="text-xs text-orange-500 mt-1 flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        Using custom image (not verified)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <hr className="border-gray-200 dark:border-gray-700" />

            {/* Section: Resources */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Resource Allocation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                    CPU Request
                  </label>
                  <input
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent sm:text-sm"
                    value={cpu}
                    onChange={(e) => setCpu(e.target.value)}
                    placeholder="e.g. 500m, 1, 2"
                  />
                  <p className="text-xs text-gray-500 mt-1">1000m = 1 Core</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                    Memory Limit
                  </label>
                  <input
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent sm:text-sm"
                    value={memory}
                    onChange={(e) => setMemory(e.target.value)}
                    placeholder="e.g. 512Mi, 4Gi"
                  />
                  <p className="text-xs text-gray-500 mt-1">Mi = Megabyte</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                    GPU Count
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent sm:text-sm"
                      value={gpuCount}
                      onChange={(e) => setGpuCount(parseInt(e.target.value) || 0)}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-sm text-gray-500">
                      Cards
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-200 dark:border-gray-700" />

            {/* Section: Execution */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Execution Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                    Priority Class
                  </label>
                  <select
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent sm:text-sm"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="normal">Normal Priority</option>
                    <option value="high">High Priority (Urgent)</option>
                  </select>
                </div>
                <div className="col-span-full">
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                    Start Command <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 font-mono">$</span>
                    </div>
                    <input
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 pl-7 pr-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      value={command}
                      onChange={(e) => setCommand(e.target.value)}
                      placeholder="python train.py --epochs 100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Overrides container default command. Arguments separated by spaces.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 flex items-center justify-end gap-3 sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 mt-6">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-violet-600 border border-transparent rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Job'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobApplyModal;
