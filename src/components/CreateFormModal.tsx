import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { createForm } from '../services/formService';
import { useTranslation } from '@nthucscc/utils';

interface CreateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: number; // Optional pre-filled project ID
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
      await createForm({
        title,
        description,
        project_id: projectId,
      });
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
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle transition-all dark:bg-gray-800">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                >
                  {t('form.title')}
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-3 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('form.field.title')}
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-1 block w-full rounded-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
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
                      className="mt-1 block w-full rounded-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                      placeholder={t('form.placeholder.description.base')}
                    />
                  </div>
                  {projectId && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('form.projectId', { id: projectId })}
                    </p>
                  )}

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-sm border border-transparent bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                      onClick={onClose}
                    >
                      {t('form.cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex justify-center rounded-sm border border-transparent bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none disabled:opacity-50"
                    >
                      {loading ? t('form.submitting') : t('form.submit')}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
