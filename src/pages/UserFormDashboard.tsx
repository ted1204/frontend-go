/* eslint-disable */
import { useEffect, useState, FormEvent } from 'react';
import UserFormApply from '../components/form/UserFormApply';
import UserFormHistory from '../components/form/UserFormHistory';
import TabSwitcher from '../components/form/TabSwitcher';
import { PageMeta } from '@nthucscc/ui';
import { PageBreadcrumb } from '../components/common/PageBreadCrumb';
import { useTranslation } from '@nthucscc/utils';
import { getProjects } from '../services/projectService';
import { createForm, getMyForms } from '../services/formService';
import { Form } from '../interfaces/form';
import { Project } from '../interfaces/project';

type ViewMode = 'grid' | 'list';

export default function UserFormDashboard() {
  // 新增 tab 狀態: 'history' 或 'apply'
  const [tab, setTab] = useState<'history' | 'apply'>('history');
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedProject, setSelectedProject] = useState<number | undefined>(undefined);
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
      (form.description && form.description.toLowerCase().includes(searchTerm.toLowerCase())),
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentForms = filteredForms.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredForms.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
      setError(t('form_error_titleRequired'));
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
      setSuccess(t('form_success_submitted'));
      setTitle('');
      setDescription('');
      setSelectedProject(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('form_error_submitFailed'));
    } finally {
      setLoading(false);
    }
  };

  const statusText = (s?: string) => (s ? t(`form_status_${s.toLowerCase()}` as any) : '');

  return (
    <div>
      <TabSwitcher
        tab={tab}
        setTab={setTab as any}
        tabs={[
          { key: 'history', label: t('form_history_title') },
          { key: 'apply', label: t('form_apply_title') },
        ]}
      />
      <PageMeta title={t('form_page_title')} description={t('form_page_description')} />
      <PageBreadcrumb pageTitle={t('form_page_title')} />

      {tab === 'history' && (
        <UserFormHistory
          loadingForms={loadingForms}
          filteredForms={filteredForms}
          currentForms={currentForms}
          viewMode={viewMode}
          setViewMode={setViewMode}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          statusText={statusText}
        />
      )}
      {tab === 'apply' && (
        <UserFormApply
          projects={projects}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          loading={loading}
          error={error}
          success={success}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
