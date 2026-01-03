// src/components/admin-storage/project/ProjectStorageCreate.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from '@nthucscc/utils';
import { toast } from 'react-hot-toast';
import { ServerIcon, CubeIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

// Services
import { createProjectStorage } from '@/core/services/storageService'; // 引用整合後的 service
import { getProjects } from '@/core/services/projectService'; // 假設你有這個 Service 取得專案列表

// Types
import { Project } from '@/core/interfaces/project'; // 假設你有這個 Interface

interface ProjectStorageCreateProps {
  onCancel: () => void;
  onSuccess: () => void; // 新增成功後的回調
}

const ProjectStorageCreate: React.FC<ProjectStorageCreateProps> = ({ onCancel, onSuccess }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [fetchingProjects, setFetchingProjects] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  // Form State
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedProjectName, setSelectedProjectName] = useState<string>('');
  const [pvcName, setPvcName] = useState<string>('');
  const [capacity, setCapacity] = useState<number>(10);

  // 1. 載入專案列表供選擇
  useEffect(() => {
    const loadProjects = async () => {
      setFetchingProjects(true);
      try {
        const data = await getProjects(); // API call
        setProjects(data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load projects');
      } finally {
        setFetchingProjects(false);
      }
    };
    loadProjects();
  }, []);

  // Handle Project Selection
  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pid = e.target.value;
    setSelectedProjectId(pid);
    const p = projects.find((proj) => proj.PID.toString() === pid);
    setSelectedProjectName(p ? p.ProjectName : '');
  };

  // 2. 提交表單建立儲存
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) {
      toast.error(t('admin.storage.project.errorSelectProject'));
      return;
    }
    if (!pvcName.trim()) {
      toast.error('Please enter a storage name');
      return;
    }

    setLoading(true);
    try {
      await createProjectStorage({
        projectId: Number(selectedProjectId),
        projectName: selectedProjectName,
        name: pvcName.trim(),
        capacity: capacity,
      });

      toast.success(t('admin.storage.project.createSuccess'));
      onSuccess(); // 通知父層刷新並切換 Tab
    } catch (err: unknown) {
      const e = err as { message?: string };
      toast.error(e.message || 'Failed to create storage');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6 flex items-start gap-3">
        <ServerIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-0.5" />
        <div>
          <h4 className="font-medium text-blue-900 dark:text-blue-300">
            {t('admin.storage.project.createGuideTitle')}
          </h4>
          <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
            {t('admin.storage.project.createGuideDesc')}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('admin.storage.project.form.project')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CubeIcon className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={selectedProjectId}
              onChange={handleProjectChange}
              disabled={fetchingProjects}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50"
            >
              <option value="">
                {fetchingProjects
                  ? 'Loading projects...'
                  : t('admin.storage.project.form.projectPlaceholder')}
              </option>
              {projects.map((p, index) => (
                <option key={`${p.PID}-${index}`} value={p.PID}>
                  {p.ProjectName} (ID: {p.PID})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Capacity Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Storage Name (PVC)
          </label>
          <input
            type="text"
            value={pvcName}
            onChange={(e) => setPvcName(e.target.value)}
            placeholder="e.g. data-1"
            className="block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">
            Unique per project; exports as /exports/&lt;name&gt;.
          </p>
          {projects
            .find((proj) => proj.PID.toString() === selectedProjectId)
            ?.Storages && projects
            .find((proj) => proj.PID.toString() === selectedProjectId)
            ?.Storages?.some((s: { name: string }) => s.name === pvcName.trim()) && (
            <p className="mt-1 text-xs text-red-500">Name already used in this project.</p>
          )}
        </div>

        {/* Capacity Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('admin.storage.project.form.capacity')}
          </label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            min={1}
            className="block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">
            {t('admin.storage.project.form.capacityHint')}
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            disabled={loading || !selectedProjectId}
            className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-70"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <PlusCircleIcon className="w-5 h-5" />
            )}
            {t('admin.storage.project.createSubmit')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectStorageCreate;
