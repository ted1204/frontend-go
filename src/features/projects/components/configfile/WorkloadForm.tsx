import { PlusIcon } from '@heroicons/react/24/outline';
import { WorkloadResource, ContainerConfig } from '../../interfaces/configFile';
import ConfigMapManager from './ConfigMapManager';
import { PVC } from '../../interfaces/pvc';
import ContainerForm from './ContainerForm';

interface WorkloadFormProps {
  resource: WorkloadResource;
  projectPvcs: PVC[];
  hasUserStorage: boolean;
  onChange: (updated: WorkloadResource) => void;
}

const WorkloadForm = ({ resource, projectPvcs, hasUserStorage, onChange }: WorkloadFormProps) => {
  const updateField = (
    field: keyof WorkloadResource,
    value: WorkloadResource[keyof WorkloadResource],
  ) => {
    onChange({ ...resource, [field]: value });
  };

  const addContainer = () => {
    const newContainer: ContainerConfig = {
      id: Date.now().toString(),
      name: `container-${resource.containers.length + 1}`,
      image: '',
      imagePullPolicy: 'IfNotPresent',
      command: '',
      args: '',
      ports: [],
      env: [],
      envFrom: [],
      mounts: [],
    };
    updateField('containers', [...resource.containers, newContainer]);
  };

  const updateContainer = (id: string, updated: ContainerConfig) => {
    updateField(
      'containers',
      resource.containers.map((c) => (c.id === id ? updated : c)),
    );
  };

  const removeContainer = (id: string) => {
    updateField(
      'containers',
      resource.containers.filter((c) => c.id !== id),
    );
  };

  const duplicateContainer = (container: ContainerConfig) => {
    const cloned = { ...container, id: Date.now().toString(), name: `${container.name}-copy` };
    updateField('containers', [...resource.containers, cloned]);
  };

  return (
    <div className="space-y-6">
      {/* Pod Settings */}
      <div className="grid grid-cols-2 gap-4">
        {resource.kind === 'Deployment' && (
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Replicas</label>
            <input
              type="number"
              min="1"
              value={resource.replicas}
              onChange={(e) => updateField('replicas', parseInt(e.target.value) || 1)}
              className="block w-full rounded-md border-gray-300 py-1.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        )}
      </div>

      {/* Selectors (labels) */}
      <div>
        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Selectors</label>
        <p className="text-xs text-gray-400">Key-value pairs used as labels and selectors</p>
        <div className="mt-2">
          <ConfigMapManager
            data={resource.selectors || []}
            onChange={(s) => updateField('selectors', s)}
          />
        </div>
      </div>
      {/* Containers List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Containers</label>
          <button
            onClick={addContainer}
            className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-500"
          >
            <PlusIcon className="h-4 w-4" /> Add Container
          </button>
        </div>

        {resource.containers.map((container, idx) => (
          <ContainerForm
            key={container.id}
            index={idx}
            container={container}
            projectPvcs={projectPvcs}
            hasUserStorage={hasUserStorage}
            onUpdate={(updated) => updateContainer(container.id, updated)}
            onRemove={() => removeContainer(container.id)}
            onDuplicate={() => duplicateContainer(container)}
          />
        ))}
      </div>
    </div>
  );
};

export default WorkloadForm;
