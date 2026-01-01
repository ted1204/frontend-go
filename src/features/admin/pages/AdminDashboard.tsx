import { Link } from 'react-router-dom';
import { PageMeta } from '@nthucscc/components-shared';
import { PageBreadcrumb } from '@nthucscc/ui';
import { useTranslation } from '@nthucscc/utils';
import { GroupIcon, TaskIcon } from '@/shared/icons';

export default function AdminDashboard() {
  const { t } = useTranslation();
  return (
    <div>
      <PageMeta
        title={t('page.admin.title') || 'Admin'}
        description={t('page.admin.description') || ''}
      />
      <PageBreadcrumb pageTitle={t('admin.dashboard') || 'Admin Dashboard'} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Manage Projects Card */}
        <Link
          to="/admin/manage-projects"
          className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
              <TaskIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {t('page.admin.manageProjects')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('page.admin.description')}
              </p>
            </div>
          </div>
        </Link>

        {/* Manage Groups Card */}
        <Link
          to="/admin/manage-groups"
          className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400">
              <GroupIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                {t('page.admin.manageGroups')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('page.admin.manageGroups')}
              </p>
            </div>
          </div>
        </Link>

        {/* Support Tickets Card */}
        <Link
          to="/admin/forms"
          className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400">
                {t('page.admin.forms')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('page.admin.forms')}</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
