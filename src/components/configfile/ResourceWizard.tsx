import { ResourceItem, ResourceKind } from '../../interfaces/configFile';
import ResourceItemForm from './ResourceItemForm';
import { createDefaultResource } from '../../utils/resourceFactories';
import { PVC } from '../../interfaces/pvc';

interface ResourceWizardProps {
  resources: ResourceItem[];
  setResources: (res: ResourceItem[]) => void;
  projectPvcs: PVC[];
  hasUserStorage: boolean;
}

export default function ResourceWizard({ 
  resources, setResources, projectPvcs, hasUserStorage 
}: ResourceWizardProps) {
  
  const addResource = (kind: ResourceKind) => {
    const id = Date.now().toString();
    const count = resources.filter((r) => r.kind === kind).length + 1;
    const baseName = `${kind.toLowerCase()}-${count}`;
    const newResource = createDefaultResource(kind, id, baseName);
    setResources([...resources, newResource]);
  };

  const removeResource = (id: string) => setResources(resources.filter((r) => r.id !== id));
  
  const updateResource = (id: string, updated: ResourceItem) => {
    setResources(resources.map((r) => (r.id === id ? updated : r)));
  };

  return (
    <div className="space-y-6">
      {/* Toolbar - 還原您原始提供的樣式 
        (不同顏色的按鈕、虛線外框、置中)
      */}
      <div className="flex flex-wrap gap-3 p-4 rounded-xl border border-dashed border-gray-300 bg-white/50 dark:border-gray-600 dark:bg-gray-800/50 justify-center">
        <button
          onClick={() => addResource('Pod')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 transition-all font-medium text-sm"
        >
          + Pod
        </button>
        <button
          onClick={() => addResource('Deployment')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 transition-all font-medium text-sm"
        >
          + Deployment
        </button>
        <button
          onClick={() => addResource('Service')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 transition-all font-medium text-sm"
        >
          + Service
        </button>
        <button
          onClick={() => addResource('ConfigMap')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300 transition-all font-medium text-sm"
        >
          + ConfigMap
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {resources.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No resources added.</div>
        ) : (
          resources.map((res, idx) => (
            <ResourceItemForm
              key={res.id}
              index={idx}
              resource={res}
              projectPvcs={projectPvcs}
              hasUserStorage={hasUserStorage}
              onUpdate={updateResource}
              onRemove={removeResource}
            />
          ))
        )}
      </div>
    </div>
  );
}