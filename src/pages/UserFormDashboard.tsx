/* eslint-disable */
import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import SearchInput from '../components/common/SearchInput';
import PageMeta from '../components/common/PageMeta';
import PageBreadcrumb from '../components/common/PageBreadCrumb';
import useTranslation from '../hooks/useTranslation';
import { getProjects } from '../services/projectService';
import { createForm, getMyForms } from '../services/formService';
import { Form } from '../interfaces/form';
import { Project } from '../interfaces/project';

type ViewMode = 'grid' | 'list';

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

  const [myForms, setMyForms] = useState<Form[]>([]);
  const [loadingForms, setLoadingForms] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
    const filteredForms = myForms.filter(
      (form) =>
        form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (form.description && form.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentForms = filteredForms.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredForms.length / itemsPerPage);

    useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  useEffect(() => {
    const fetchForms = async () => {
      setLoadingForms(true);
      try {
        const data = await getMyForms();
        setMyForms(data);
      } catch (e) {
        // ignore
      } finally {
        setLoadingForms(false);
      }
    };
    fetchForms();
  }, []);

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

  const statusText = (s?: string) => (s ? t('form.status.' + s.toLowerCase()) : '');

  return (
    <div>
      <PageMeta
        title={t('form.page.title')}
        description={t('form.page.description')}
      />
      <PageBreadcrumb pageTitle={t('form.page.title')} />

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 p-6 mb-8">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{t('form.history.title')}</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                title={t('view.grid')}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/></svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`rounded p-1.5 transition-colors ${viewMode === 'list' ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                title={t('view.list')}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
            <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder={t('form.label.title') + '/' + t('form.label.description')} />
          </div>
        </div>
        {loadingForms ? (
          <div className="py-8 text-center text-gray-400">{t('form.history.loading')}</div>
        ) : filteredForms.length === 0 ? (
          <div className="py-8 text-center text-gray-400">{t('form.history.empty')}</div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {currentForms.map((f) => (
              <div key={f.ID} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-block w-2 h-2 rounded-full ${f.status === 'Completed' ? 'bg-green-500' : f.status === 'Rejected' ? 'bg-red-500' : f.status === 'Processing' ? 'bg-yellow-400' : 'bg-gray-400'}`}></span>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${f.status === 'Completed' ? 'bg-green-100 text-green-800' : f.status === 'Rejected' ? 'bg-red-100 text-red-800' : f.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'} dark:bg-opacity-20`}>{statusText(f.status) || f.status}</span>
                </div>
                <div className="font-bold text-lg text-gray-800 dark:text-white line-clamp-1">{f.title}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{f.description}</div>
                <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-400 dark:text-gray-500">
                  <span>{t('form.label.project')}: {f.project?.ProjectName || '-'}</span>
                  <span>{t('createdAt')}: {new Date(f.CreatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border">
              <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-2">{t('form.label.title')}</th>
                  <th className="px-4 py-2">{t('form.label.description')}</th>
                  <th className="px-4 py-2">{t('form.label.project')}</th>
                  <th className="px-4 py-2">{t('table.status')}</th>
                  <th className="px-4 py-2">{t('createdAt')}</th>
                </tr>
              </thead>
              <tbody>
                {currentForms.map((f) => (
                  <tr key={f.ID} className="border-t">
                    <td className="px-4 py-2 font-medium text-gray-800 dark:text-white">{f.title}</td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{f.description}</td>
                    <td className="px-4 py-2">{f.project?.ProjectName || '-'}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${f.status === 'Completed' ? 'bg-green-100 text-green-800' : f.status === 'Rejected' ? 'bg-red-100 text-red-800' : f.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'} dark:bg-opacity-20`}>
                        {statusText(f.status) || f.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{new Date(f.CreatedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Pagination Controls */}
        {!loadingForms && filteredForms.length > itemsPerPage && (
          <div className="mt-4">
            <button
              className="mr-2 px-3 py-1 rounded border bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              {t('pagination.prev')}
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t('pagination.pageOf', { current: currentPage, total: totalPages })}
            </span>
            <button
              className="ml-2 px-3 py-1 rounded border bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              {t('pagination.next')}
            </button>
          </div>
        )}
      </div>
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
  );
}
