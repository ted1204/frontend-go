import { useState } from 'react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  TrashIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import { ContainerConfig } from '../../interfaces/configFile';
import { PVC } from '../../interfaces/pvc';

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

  const handleChange = (field: keyof ContainerConfig, value: any) => {
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
              const current = { mounts: container.mounts };
              const next = typeof action === 'function' ? action(current as any) : action;
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
        </div>
      )}
    </div>
  );
};

export default ContainerForm;
