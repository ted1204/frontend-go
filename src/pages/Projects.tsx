import { useState, useEffect, useMemo, useCallback } from 'react';
import { PageBreadcrumb } from '../components/common/PageBreadCrumb';
import { PageMeta } from '@nthucscc/ui';
import { Project } from '../interfaces/project';
import { getProjects } from '../services/projectService';
import { getGroupsByUser } from '../services/userGroupService';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import { Pagination } from '@nthucscc/ui';
import { SearchInput } from '@nthucscc/ui';
import { GridIcon } from '../icons';
import { useTranslation } from '@nthucscc/utils';

// --- 優化 1: 將子元件移出主 Component，避免每次 Render 都重新定義 ---

// Helper component for the loading state (Skeleton)
const SkeletonCard = () => (
  <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
    <div className="mb-4 h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600"></div>
    <div className="mb-2 h-6 w-3/4 rounded bg-gray-300 dark:bg-gray-600"></div>
    <div className="h-4 w-full rounded bg-gray-300 dark:bg-gray-600"></div>
    <div className="mt-1 h-4 w-5/6 rounded bg-gray-300 dark:bg-gray-600"></div>
  </div>
);

// Helper component for displaying states like error or no projects
const StateDisplay = ({ message }: { message: string }) => (
  <div className="col-span-full mt-10 flex flex-col items-center justify-center text-center">
    <p className="text-lg text-gray-500 dark:text-gray-400">{message}</p>
  </div>
);

// List View Component
// 使用 React.memo 避免不必要的重繪，雖然在這個簡單列表效果有限，但若是長列表會有幫助
const ProjectListItem = ({
  project,
  onClick,
  t, // Pass t function as prop or use hook inside
}: {
  project: Project;
  onClick: (id: number) => void;
  t: (key: string) => string;
}) => (
  <div
    onClick={() => onClick(project.PID)}
    className="group flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800 cursor-pointer"
  >
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
        <span className="font-bold">{project.ProjectName.charAt(0).toUpperCase()}</span>
      </div>
      <div>
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
          {project.ProjectName}
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
          {project.Description || t('project.noDescription')}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-6">
      <div className="hidden sm:block text-right">
        <p className="text-xs text-gray-400">{t('common.createdAt')}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {new Date(project.CreatedAt).toLocaleDateString()}
        </p>
      </div>
      <div className="hidden sm:block text-right">
        <p className="text-xs text-gray-400">{t('groupId')}</p>
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
          {project.GID}
        </span>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-400 group-hover:text-blue-500"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  </div>
);

export default function Projects() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI States
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const itemsPerPage = 5;

  // Data Fetching
  useEffect(() => {
    // 使用 AbortController 避免組件卸載後 setState 造成的 memory leak (雖然 React 18 會自動處理，但這是好習慣)
    const controller = new AbortController();

    const fetchAndFilterProjects = async () => {
      setLoading(true);
      try {
        const userData = localStorage.getItem('userData');
        if (!userData) {
          throw new Error(t('error.userNotLogged'));
        }
        const { user_id: userId } = JSON.parse(userData);

        const [allProjects, userGroups] = await Promise.all([
          getProjects(),
          getGroupsByUser(userId),
        ]);

        if (controller.signal.aborted) return;

        // Create a Set for O(1) lookup complexity instead of O(N) array includes
        const userGroupIds = new Set(userGroups.map((ug) => ug.GID));

        const filteredProjects = allProjects.filter((project) => userGroupIds.has(project.GID));

        setProjects(filteredProjects);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : t('error.fetchData'));
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchAndFilterProjects();

    return () => controller.abort();
  }, [t]);

  // --- 優化 2: 使用 useMemo 快取過濾結果 ---
  // 只有當 projects 或 searchTerm 改變時才重新計算過濾
  const filteredProjects = useMemo(() => {
    if (!searchTerm) return projects;

    const lowerTerm = searchTerm.toLowerCase();
    return projects.filter(
      (project) =>
        project.ProjectName.toLowerCase().includes(lowerTerm) ||
        (project.Description && project.Description.toLowerCase().includes(lowerTerm)),
    );
  }, [projects, searchTerm]);

  // --- 優化 3: 使用 useMemo 快取分頁結果 ---
  const currentProjects = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredProjects.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredProjects, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  // Reset page on search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // --- 優化 4: 使用 useCallback 保持函數引用穩定 ---
  const handleProjectClick = useCallback(
    (projectId: number) => {
      navigate(`/projects/${projectId}`);
    },
    [navigate],
  );

  return (
    <div>
      <PageMeta title={t('page.projects.title')} description={t('page.projects.description')} />
      <PageBreadcrumb pageTitle={t('breadcrumb.projects')} />

      <div className="rounded-2xl p-4 md:p-6 2xl:p-10">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
            {t('project.list.title')}
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded p-1.5 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
                title={t('view_grid')}
              >
                <GridIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`rounded p-1.5 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
                title={t('view_list')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder={t('search_projectsPlaceholder')}
            />
          </div>
        </div>

        {/* The main content area */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading ? (
              [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
            ) : error ? (
              <StateDisplay message={`${t('common.error') || 'Error'}: ${error}`} />
            ) : filteredProjects.length === 0 ? (
              <StateDisplay
                message={
                  projects.length === 0
                    ? t('storage.emptyAssigned')
                    : t('storage.emptyFilter', { term: searchTerm })
                }
              />
            ) : (
              currentProjects.map((project) => (
                <ProjectCard key={project.PID} project={project} onClick={handleProjectClick} />
              ))
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 h-20"
                ></div>
              ))
            ) : error ? (
              <StateDisplay message={`${t('common.error') || 'Error'}: ${error}`} />
            ) : filteredProjects.length === 0 ? (
              <StateDisplay
                message={
                  projects.length === 0
                    ? t('storage.emptyAssigned')
                    : t('storage.emptyFilter', { term: searchTerm })
                }
              />
            ) : (
              currentProjects.map((project) => (
                <ProjectListItem
                  key={project.PID}
                  project={project}
                  onClick={handleProjectClick}
                  t={t}
                />
              ))
            )}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && !error && filteredProjects.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
