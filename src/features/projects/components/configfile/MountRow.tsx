// src/components/add-config/MountRow.tsx
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { MountConfig } from '@/core/interfaces/configFile';
import { PVC } from '@/core/interfaces/pvc';

interface MountRowProps {
  mount: MountConfig;
  projectPvcs: PVC[];
  hasUserStorage: boolean; // NEW: Status of user storage
  hasProjectStorage: boolean; // NEW: Status of project storage
  onChange: (id: string, field: keyof MountConfig, value: unknown) => void;
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
            <span className="truncate">Home Drive ({'{{nfsServer}}'})</span>
          </div>
        ) : (
          <select
            value={mount.pvcName || ''}
            onChange={(e) => onChange(mount.id, 'pvcName', e.target.value)}
            className="block w-full rounded-md border-gray-300 bg-white py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">-- Select PVC --</option>
            {projectPvcs.map((p, idx) => (
              <option key={`pvc-${idx}-${p.name}`} value={p.name}>
                {p.name} ({p.size})
              </option>
            ))}
          </select>
        )}
        {mount.type === 'project-pvc' && mount.pvcName && (
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <p>Gateway exports /exports/{mount.pvcName}; mounting the root directory.</p>
            <p className="text-amber-600 dark:text-amber-400">
              ⚠️ PVC must support ReadWriteMany for multiple Pods (e.g., FileBrowser + your
              workload) to access simultaneously.
            </p>
          </div>
        )}
      </div>

      {/* 3. Source Subpaths (support multiple subPath -> mountPath pairs) */}
      <div className="flex-1 space-y-1 min-w-[200px]">
        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Source Subpaths
        </label>
        <div className="space-y-2">
          {mount.subPaths?.map((sp) => (
            <div key={sp.id} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Source subPath (e.g., data)"
                value={sp.subPath}
                onChange={(e) => {
                  const next = mount.subPaths.map((s) =>
                    s.id === sp.id ? { ...s, subPath: e.target.value } : s,
                  );
                  onChange(mount.id, 'subPaths', next);
                }}
                className="block w-1/2 rounded-md border-gray-300 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <input
                type="text"
                placeholder="Container path (e.g., /data)"
                value={sp.mountPath}
                onChange={(e) => {
                  const next = mount.subPaths.map((s) =>
                    s.id === sp.id ? { ...s, mountPath: e.target.value } : s,
                  );
                  onChange(mount.id, 'subPaths', next);
                }}
                className="block w-1/2 rounded-md border-blue-200 bg-blue-50/50 py-2 text-sm font-mono text-gray-800 focus:border-blue-500 focus:ring-blue-500 dark:border-blue-900/50 dark:bg-blue-900/10 dark:text-white"
              />
              <button
                type="button"
                onClick={() => {
                  const next = (mount.subPaths || []).filter((s) => s.id !== sp.id);
                  onChange(mount.id, 'subPaths', next);
                }}
                className="p-1 text-gray-400 hover:text-red-500"
                title="Remove subpath"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          ))}

          <div>
            <button
              type="button"
              onClick={() => {
                const newEntry = { id: Date.now().toString(), subPath: '', mountPath: '/' };
                onChange(mount.id, 'subPaths', [...(mount.subPaths || []), newEntry]);
              }}
              className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700 hover:bg-gray-200"
            >
              <PlusIcon className="h-4 w-4" /> Add Subpath
            </button>
          </div>
        </div>
      </div>

      {/* Note: container mount paths are handled per-subpath above. */}

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
