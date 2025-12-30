import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageBreadcrumb } from '../components/common/PageBreadCrumb';
import { PageMeta } from '@nthucscc/ui';
import { UserCircleIcon, CubeIcon } from '@heroicons/react/24/outline';

// Import the decoupled components
import { PersonalHub } from '../components/storage/PersonalHub';
import { ProjectStorageManager } from '../components/storage/ProjectStorageManager';

// --- Main Page Component ---
// Acts as a shell to switch between Personal and Project storage views.
function BrowserPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'personal' | 'project'>('personal');

  return (
    <>
      <PageMeta title={`${t('storage.pageTitle')} | Platform`} />
      <PageBreadcrumb pageTitle={t('storage.breadcrumb')} />

      <div className="space-y-6 max-w-7xl mx-auto">
        {/* --- Tab Navigation --- */}
        <div className="bg-white dark:bg-gray-800 p-1.5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 inline-flex">
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'personal'
                ? 'bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-white shadow-sm ring-1 ring-black/5'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            <UserCircleIcon className="h-5 w-5" /> {t('storage.tab.personal')}
          </button>
          <button
            onClick={() => setActiveTab('project')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'project'
                ? 'bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-white shadow-sm ring-1 ring-black/5'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            <CubeIcon className="h-5 w-5" /> {t('storage.tab.project')}
          </button>
        </div>

        {/* --- Content Area --- */}
        <div className="min-h-[500px] animate-in fade-in slide-in-from-bottom-2 duration-300">
          {activeTab === 'personal' ? <PersonalHub /> : <ProjectStorageManager />}
        </div>
      </div>
    </>
  );
}

export default BrowserPage;
