// src/components/add-config/MountRow.tsx
import { TrashIcon } from '@heroicons/react/24/outline';
import { MountConfig } from '@/core/interfaces/configFile';
import { PVC } from '@/core/interfaces/pvc';

interface MountRowProps {
  mount: MountConfig;
  projectPvcs: PVC[];
  hasUserStorage: boolean; // NEW: Status of user storage
  hasProjectStorage: boolean; // NEW: Status of project storage
  onChange: (id: string, field: keyof MountConfig, value: string) => void;
  onRemove: (id: string) => void;
}

const MountRow = ({
  mount,
  projectPvcs,
  hasUserStorage,
  hasProjectStorage,
  onChange,
  onRemove,
}: MountRowProps) => {
  return (
    <div className="group relative flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800 sm:flex-row sm:items-start">
      {/* 1. Storage Type Selection */}
      <div className="flex-1 space-y-1 min-w-[140px]">
        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Source Type
        </label>
        <select
          value={mount.type}
          onChange={(e) => onChange(mount.id, 'type', e.target.value)}
          className="block w-full rounded-md border-gray-300 bg-gray-50 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          {/* Conditionally render options based on availability */}
          {hasUserStorage && <option value="user-storage">Personal Storage</option>}
          {hasProjectStorage && <option value="project-pvc">Project Storage</option>}
        </select>
      </div>

      {/* 2. Source Selection */}
      <div className="flex-[1.5] space-y-1 min-w-[160px]">
        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {mount.type === 'user-storage' ? 'Source' : 'Select PVC'}
        </label>

        {mount.type === 'user-storage' ? (
          <div className="flex items-center rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-400 cursor-not-allowed">
            <span className="truncate">Home Drive ({'{{username}}'})</span>
          </div>
        ) : (
          <select
            value={mount.pvcName || ''}
            onChange={(e) => onChange(mount.id, 'pvcName', e.target.value)}
            className="block w-full rounded-md border-gray-300 bg-white py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">-- Select PVC --</option>
            {projectPvcs.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name} ({p.size})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* 3. Source Subpath */}
      <div className="flex-1 space-y-1 min-w-[120px]">
        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Source Subpath
        </label>
        <input
          type="text"
          placeholder="/"
          value={mount.subPath}
          onChange={(e) => onChange(mount.id, 'subPath', e.target.value)}
          className="block w-full rounded-md border-gray-300 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
        />
      </div>

      {/* 4. Container Mount Path */}
      <div className="flex-1 space-y-1 min-w-[140px]">
        <label className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Container Path
        </label>
        <input
          type="text"
          placeholder="/mnt/data"
          value={mount.mountPath}
          onChange={(e) => onChange(mount.id, 'mountPath', e.target.value)}
          className="block w-full rounded-md border-blue-200 bg-blue-50/50 py-2 text-sm font-mono text-gray-800 focus:border-blue-500 focus:ring-blue-500 dark:border-blue-900/50 dark:bg-blue-900/10 dark:text-white"
        />
      </div>

      {/* Remove Button */}
      <div className="pt-6 sm:pt-0 sm:mt-6">
        <button
          type="button"
          onClick={() => onRemove(mount.id)}
          className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
          title="Remove Volume"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default MountRow;
