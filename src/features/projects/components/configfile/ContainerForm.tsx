import { useState } from 'react';
import { ChevronDownIcon, TrashIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import type { ContainerConfig, WizardData } from '@/core/interfaces/configFile';
import { PVC } from '@/core/interfaces/pvc';

// Import managers
import MountManager from './MountManager';
import EnvVarManager from './EnvVarManager';
import PortManager from './PortManager';

interface ContainerFormProps {
  container: ContainerConfig;
  index: number;
  projectPvcs: PVC[];
  hasUserStorage: boolean;
  onUpdate: (updated: ContainerConfig) => void;
  onRemove: () => void;
  onDuplicate: () => void;
}

const ContainerForm = ({
  container,
  index,
  projectPvcs,
  hasUserStorage,
  onUpdate,
  onRemove,
  onDuplicate,
}: ContainerFormProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleChange = (
    field: keyof ContainerConfig,
    value: ContainerConfig[keyof ContainerConfig],
  ) => {
    onUpdate({ ...container, [field]: value });
  };

  return (
    <div className="rounded-md border border-gray-300 bg-white shadow-sm dark:border-gray-600 dark:bg-gray-800">
      {/* Container Header */}
      <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-t-md border-b border-gray-200 dark:bg-gray-700 dark:border-gray-600">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
            {index + 1}
          </span>
          <input
            type="text"
            value={container.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="bg-transparent text-sm font-bold text-gray-800 focus:outline-none focus:underline dark:text-white"
            placeholder="Container Name"
          />
        </div>
        <div className="flex gap-1">
          <button
            onClick={onDuplicate}
            title="Duplicate Container"
            className="p-1 text-gray-400 hover:text-indigo-600"
          >
            <DocumentDuplicateIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <ChevronDownIcon
              className={`h-4 w-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>
          <button
            onClick={onRemove}
            title="Remove Container"
            className="p-1 text-gray-400 hover:text-red-600"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Image & Pull Policy */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-500">Image</label>
              <input
                type="text"
                value={container.image}
                onChange={(e) => handleChange('image', e.target.value)}
                placeholder="image:tag"
                className="block w-full rounded-md border-gray-300 py-1 text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-500">Pull Policy</label>
              <select
                value={container.imagePullPolicy}
                onChange={(e) => handleChange('imagePullPolicy', e.target.value)}
                className="block w-full rounded-md border-gray-300 py-1 text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="IfNotPresent">IfNotPresent</option>
                <option value="Always">Always</option>
                <option value="Never">Never</option>
              </select>
            </div>
          </div>

          {/* Networking & Env */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PortManager ports={container.ports} onChange={(p) => handleChange('ports', p)} />
            <EnvVarManager envVars={container.env} onChange={(e) => handleChange('env', e)} />
          </div>

          {/* ConfigMap Ref (envFrom) */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-gray-500">
              Env From ConfigMap (Comma separated names)
            </label>
            <input
              type="text"
              value={container.envFrom.join(', ')}
              onChange={(e) =>
                handleChange(
                  'envFrom',
                  e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter((s) => s),
                )
              }
              placeholder="e.g. my-config, global-env"
              className="block w-full rounded-md border-gray-300 py-1 text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Storage */}
          <MountManager
            mounts={container.mounts}
            projectPvcs={projectPvcs}
            hasUserStorage={hasUserStorage}
            setWizardData={(action) => {
              const current: WizardData = {
                image: container.image || '',
                gpu: 0,
                mounts: container.mounts,
                command: container.command || '',
                args: container.args || '',
              };
              const next = typeof action === 'function' ? action(current) : action;
              handleChange('mounts', next.mounts);
            }}
          />

          {/* Command & Args (Multi-line Support) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-500">Command</label>
              <textarea
                rows={3}
                value={container.command}
                onChange={(e) => handleChange('command', e.target.value)}
                placeholder='["/bin/bash", "-c"]'
                className="block w-full rounded-md border-gray-300 py-1 text-xs font-mono dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <p className="text-[9px] text-gray-400">JSON array or string</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-500">Args</label>
              <textarea
                rows={3}
                value={container.args}
                onChange={(e) => handleChange('args', e.target.value)}
                placeholder={'source setup.bash &&\nros2 launch ...'}
                className="block w-full rounded-md border-gray-300 py-1 text-xs font-mono dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <p className="text-[9px] text-gray-400">Multiline strings supported</p>
            </div>
          </div>

          {/* Resources Section */}
          <div className="space-y-3 p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700/50 dark:to-gray-800/50 border border-blue-200 dark:border-gray-600">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                />
              </svg>
              <label className="text-sm font-bold text-gray-800 dark:text-gray-200">
                Resource Limits
              </label>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 -mt-1">
              Define CPU, Memory, and GPU resource requirements
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Requests Column */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-blue-300 dark:border-gray-600">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <label className="text-xs font-bold uppercase text-green-700 dark:text-green-400">
                    Requests (Minimum)
                  </label>
                </div>

                {/* CPU Request */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-300">
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 7H7v6h6V7z" />
                      <path
                        fillRule="evenodd"
                        d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    CPU
                  </label>
                  <input
                    type="text"
                    value={container.resources?.requests?.cpu || ''}
                    onChange={(e) =>
                      handleChange('resources', {
                        ...container.resources,
                        requests: {
                          ...container.resources?.requests,
                          cpu: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g., 100m, 0.5, 2"
                    className="block w-full rounded-lg border-gray-300 bg-white dark:bg-gray-800 py-2 px-3 text-sm shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:border-gray-600 dark:text-white placeholder-gray-400"
                  />
                </div>

                {/* Memory Request */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-300">
                    <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                      <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                      <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                    </svg>
                    Memory
                  </label>
                  <input
                    type="text"
                    value={container.resources?.requests?.memory || ''}
                    onChange={(e) =>
                      handleChange('resources', {
                        ...container.resources,
                        requests: {
                          ...container.resources?.requests,
                          memory: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g., 128Mi, 1Gi, 2Gi"
                    className="block w-full rounded-lg border-gray-300 bg-white dark:bg-gray-800 py-2 px-3 text-sm shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:border-gray-600 dark:text-white placeholder-gray-400"
                  />
                </div>

                {/* GPU Request */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-300">
                    <svg
                      className="w-4 h-4 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                        clipRule="evenodd"
                      />
                    </svg>
                    GPU
                  </label>
                  <input
                    type="text"
                    value={container.resources?.requests?.gpu || ''}
                    onChange={(e) =>
                      handleChange('resources', {
                        ...container.resources,
                        requests: {
                          ...container.resources?.requests,
                          gpu: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g., 1, 2"
                    className="block w-full rounded-lg border-gray-300 bg-white dark:bg-gray-800 py-2 px-3 text-sm shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:border-gray-600 dark:text-white placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Limits Column */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-blue-300 dark:border-gray-600">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <label className="text-xs font-bold uppercase text-red-700 dark:text-red-400">
                    Limits (Maximum)
                  </label>
                </div>

                {/* CPU Limit */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-300">
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 7H7v6h6V7z" />
                      <path
                        fillRule="evenodd"
                        d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    CPU
                  </label>
                  <input
                    type="text"
                    value={container.resources?.limits?.cpu || ''}
                    onChange={(e) =>
                      handleChange('resources', {
                        ...container.resources,
                        limits: {
                          ...container.resources?.limits,
                          cpu: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g., 200m, 1, 4"
                    className="block w-full rounded-lg border-gray-300 bg-white dark:bg-gray-800 py-2 px-3 text-sm shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:border-gray-600 dark:text-white placeholder-gray-400"
                  />
                </div>

                {/* Memory Limit */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-300">
                    <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                      <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                      <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                    </svg>
                    Memory
                  </label>
                  <input
                    type="text"
                    value={container.resources?.limits?.memory || ''}
                    onChange={(e) =>
                      handleChange('resources', {
                        ...container.resources,
                        limits: {
                          ...container.resources?.limits,
                          memory: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g., 256Mi, 2Gi, 4Gi"
                    className="block w-full rounded-lg border-gray-300 bg-white dark:bg-gray-800 py-2 px-3 text-sm shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:border-gray-600 dark:text-white placeholder-gray-400"
                  />
                </div>

                {/* GPU Limit */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-300">
                    <svg
                      className="w-4 h-4 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                        clipRule="evenodd"
                      />
                    </svg>
                    GPU
                  </label>
                  <input
                    type="text"
                    value={container.resources?.limits?.gpu || ''}
                    onChange={(e) =>
                      handleChange('resources', {
                        ...container.resources,
                        limits: {
                          ...container.resources?.limits,
                          gpu: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g., 1, 2"
                    className="block w-full rounded-lg border-gray-300 bg-white dark:bg-gray-800 py-2 px-3 text-sm shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:border-gray-600 dark:text-white placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 mt-3 p-3 bg-blue-100/50 dark:bg-gray-700/50 rounded-lg border border-blue-200 dark:border-gray-600">
              <svg
                className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                <strong>Note:</strong> Leave fields empty to skip resource limits. GPU uses{' '}
                <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-xs">
                  nvidia.com/gpu
                </code>{' '}
                resource. Limits should be greater than or equal to requests.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContainerForm;
