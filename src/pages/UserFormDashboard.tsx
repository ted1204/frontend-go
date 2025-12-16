import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import PageMeta from '../components/common/PageMeta';
import PageBreadcrumb from '../components/common/PageBreadCrumb';
import useTranslation from '../hooks/useTranslation';
import { getProjects } from '../services/projectService';
import { createForm } from '../services/formService';
import { Project } from '../interfaces/project';

export default function UserFormDashboard() {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedProject, setSelectedProject] = useState<number | undefined>(
    undefined
  );
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (e) {
        /* ignore silently */
      }
    };
    load();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(t('form.error.titleRequired'));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await createForm({
        project_id: selectedProject,
        title: title.trim(),
        description,
      });
      setSuccess(t('form.success.submitted'));
      setTitle('');
      setDescription('');
      setSelectedProject(undefined);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t('form.error.submitFailed')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageMeta
        title={t('form.page.title')}
        description={t('form.page.description')}
      />
      <PageBreadcrumb pageTitle={t('form.page.title')} />

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 p-6">
        <h3 className="mb-4 text-xl font-semibold">{t('form.adminTitle')}</h3>

        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
        {success && (
          <div className="mb-4 text-sm text-green-600">{success}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t('form.label.project')}
            </label>
            <select
              value={selectedProject ?? ''}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setSelectedProject(
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-700"
            >
              <option value="">{t('form.select.none')}</option>
              {projects.map((p) => (
                <option key={p.PID} value={p.PID}>
                  {p.ProjectName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t('form.label.title')}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-700"
              placeholder={t('form.placeholder.title')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t('form.label.description')}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-700"
              placeholder={t('form.placeholder.description.long')}
            />
          </div>

          <div>
            <button
              type="submit"
              className="px-4 py-2 bg-violet-600 text-white rounded disabled:opacity-60"
              disabled={loading}
            >
              {loading ? t('form.submitting') : t('form.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
