import { useState } from 'react';
import { createForm } from '@/core/services/formService';
import { useTranslation } from '@nthucscc/utils';
import { BaseModal } from '@nthucscc/ui';

interface CreateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: number;
}

export default function CreateFormModal({ isOpen, onClose, projectId }: CreateFormModalProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createForm({ title, description, project_id: projectId, tag: '' });
      alert(t('form.created'));
      onClose();
      setTitle('');
      setDescription('');
    } catch (error) {
      alert(t('form.createFailed') + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={t('form.title')} maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('form.field.title')}
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
            placeholder={t('form.exampleTitle')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('form.field.description')}
          </label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
            placeholder={t('form.placeholder.description.base')}
          />
        </div>
        {projectId && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('form.projectId', { id: projectId })}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
            onClick={onClose}
          >
            {t('form.cancel')}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? t('form.submitting') : t('form.submit')}
          </button>
        </div>
      </form>
    </BaseModal>
  );
}
