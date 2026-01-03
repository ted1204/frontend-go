// src/components/add-config/MountManager.tsx
import { PlusIcon, CubeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { MountConfig, MountType, WizardData } from '@/core/interfaces/configFile';
import { PVC } from '@/core/interfaces/pvc';
import MountRow from './MountRow';

interface MountManagerProps {
  mounts: MountConfig[];
  projectPvcs: PVC[];
  hasUserStorage: boolean; // NEW
  setWizardData: React.Dispatch<React.SetStateAction<WizardData>>;
}

const MountManager = ({
  mounts,
  projectPvcs,
  hasUserStorage,
  setWizardData,
}: MountManagerProps) => {
  const hasProjectStorage = projectPvcs.length > 0;
  const isAnyStorageAvailable = hasUserStorage || hasProjectStorage;

  const addMount = () => {
    // Determine a valid default type
    let defaultType: MountType = 'user-storage';

    if (hasUserStorage) {
      defaultType = 'user-storage';
    } else if (hasProjectStorage) {
      defaultType = 'project-pvc';
    } else {
      // Should not happen if button is disabled, but safety check
      return;
    }

    const defaultPVC =
      defaultType === 'project-pvc' && projectPvcs.length > 0 ? projectPvcs[0].name : undefined;

    const newMount: MountConfig = {
      id: Date.now().toString(),
      type: defaultType,
      subPath: defaultPVC ? defaultPVC : '',
      mountPath: '/data',
      pvcName: defaultPVC,
    };

    setWizardData((prev) => ({ ...prev, mounts: [...prev.mounts, newMount] }));
  };

  const removeMount = (id: string) => {
    setWizardData((prev) => ({
      ...prev,
      mounts: prev.mounts.filter((m) => m.id !== id),
    }));
  };

  const updateMount = (id: string, field: keyof MountConfig, value: string) => {
    setWizardData((prev) => ({
      ...prev,
      mounts: prev.mounts.map((m) => {
        if (m.id !== id) return m;
        // Reset pvcName if switching to user-storage
        if (field === 'type' && value === 'user-storage') {
          return { ...m, type: value as MountType, pvcName: undefined, subPath: '' };
        }
        // Auto-select first PVC if switching to project-pvc
        if (field === 'type' && value === 'project-pvc' && !m.pvcName && projectPvcs.length > 0) {
          const first = projectPvcs[0].name;
          return { ...m, type: value as MountType, pvcName: first, subPath: first };
        }
        // When pvc changes, set subPath to pvc default if empty
        if (field === 'pvcName') {
          return { ...m, pvcName: value, subPath: value ? value : '' };
        }
        return { ...m, [field]: value };
      }),
    }));
  };

  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <CubeIcon className="h-5 w-5 text-blue-500" />
          Volume Mounts
        </h4>

        {isAnyStorageAvailable ? (
          <button
            type="button"
            onClick={addMount}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all active:scale-95"
          >
            <PlusIcon className="h-4 w-4" />
            Add Volume
          </button>
        ) : (
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <ExclamationTriangleIcon className="h-4 w-4" />
            No storage available
          </span>
        )}
      </div>

      {mounts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-8 text-center dark:border-gray-600">
          <p className="text-sm text-gray-500 dark:text-gray-400">No volumes configured.</p>
          <p className="text-xs text-gray-400">
            {isAnyStorageAvailable
              ? 'Click "Add Volume" to mount storage to your Pod.'
              : 'Initialize Personal Storage or create Project Storage to enable mounts.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {mounts.map((mount) => (
            <MountRow
              key={mount.id}
              mount={mount}
              projectPvcs={projectPvcs}
              hasUserStorage={hasUserStorage}
              hasProjectStorage={hasProjectStorage}
              onChange={updateMount}
              onRemove={removeMount}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MountManager;
