import { useState, useEffect } from 'react';
import {
  getAllowedImages,
  addProjectImage,
  removeProjectImage,
  AllowedImage,
  AddProjectImageInput,
} from '@/core/services/imageService';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '@nthucscc/utils';

interface ProjectImageManagementProps {
  projectId: number;
}

export default function ProjectImageManagement({ projectId }: ProjectImageManagementProps) {
  const { t } = useTranslation();
  const [images, setImages] = useState<AllowedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<AddProjectImageInput>({ name: '', tag: '' });
  const [adding, setAdding] = useState(false);

  const loadImages = async () => {
    try {
      setLoading(true);
      // console.log('Loading images for project:', projectId);
      const data = await getAllowedImages(projectId);
      // console.log('Loaded images data:', data);
      setImages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load images:', err);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.tag) return;

    try {
      setAdding(true);
      const newImage = await addProjectImage(projectId, formData);
      // Immediately update local state while reloading from server
      setImages((prev) => [...prev, newImage]);
      setFormData({ name: '', tag: '' });
      setShowAddForm(false);
      // Reload to ensure consistency with server
      await loadImages();
    } catch (err) {
      alert(t('project.images.addError') + (err instanceof Error ? err.message : String(err)));
      // Reload to sync state with server on error
      await loadImages();
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveImage = async (imageId: number) => {
    if (!confirm(t('project.images.confirmRemove'))) return;
    try {
      await removeProjectImage(projectId, imageId);
      setImages((prev) => prev.filter((img) => img.ID !== imageId));
    } catch (err) {
      alert(t('project.images.removeError') + (err instanceof Error ? err.message : String(err)));
      await loadImages();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('project.images.title')}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t('project.images.description')}
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          {t('project.images.add')}
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAddImage}
          className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
        >
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            {t('project.images.addNew')}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('project.images.name')}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('project.images.namePlaceholder')}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('project.images.tag')}
              </label>
              <input
                type="text"
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                placeholder={t('project.images.tagPlaceholder')}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={adding}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              {adding ? t('project.images.adding') : t('project.images.add')}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setFormData({ name: '', tag: '' });
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 text-sm"
            >
              {t('project.images.cancel')}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-500">{t('project.images.loading')}</div>
      ) : (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6"
                >
                  {t('project.images.colImage')}
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                >
                  {t('project.images.colType')}
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">{t('project.images.colActions')}</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
              {images.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    {t('project.images.noImages')}
                  </td>
                </tr>
              ) : (
                images.map((img) => (
                  <tr key={img.ID}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                      <div className="font-medium text-gray-900 dark:text-white text-lg">
                        {img.Name}:{img.Tag}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {img.IsGlobal ? (
                        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900/30 dark:text-green-400">
                          {t('project.images.global')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400">
                          {t('project.images.project')}
                        </span>
                      )}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      {!img.IsGlobal && (
                        <button
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title={t('project.images.remove')}
                          onClick={() => handleRemoveImage(img.ID)}
                        >
                          <TrashIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-2">
          <svg
            className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <p className="font-medium mb-1">{t('project.images.about.title')}</p>
            <ul className="list-disc list-inside space-y-1 text-xs text-gray-600 dark:text-gray-400">
              <li>
                <strong>{t('project.images.about.globalLabel')}</strong>{' '}
                {t('project.images.about.globalDesc')}
              </li>
              <li>
                <strong>{t('project.images.about.projectLabel')}</strong>{' '}
                {t('project.images.about.projectDesc')}
              </li>
              <li>{t('project.images.about.accessible')}</li>
              <li>{t('project.images.about.allowed')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
