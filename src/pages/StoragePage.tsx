import React, { useState } from 'react';
import { useTranslation } from '@tailadmin/utils';

// Icons
import { ServerStackIcon, UserCircleIcon, CubeIcon } from '@heroicons/react/24/outline';

// Components
import ProjectStorageManagement from '../components/admin-storage/project/ProjectStorageManagement';
import UserStorageManagement from '../components/admin-storage/user/UserStorageManagement';

type MainTab = 'user' | 'project';

const StoragePage: React.FC = () => {
  const { t } = useTranslation();
  const [mainTab, setMainTab] = useState<MainTab>('user');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-8 flex items-center space-x-3">
        <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
          <ServerStackIcon className="w-8 h-8 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            {t('admin.storage.title') || 'Storage Administration'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Centralized management for User Hubs and Project PVCs.
          </p>
        </div>
      </div>

      {/* Main Tab Switcher (Pill Shape) */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl inline-flex shadow-inner">
          <button
            onClick={() => setMainTab('user')}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
              ${
                mainTab === 'user'
                  ? 'bg-white dark:bg-gray-700 text-violet-600 dark:text-violet-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }
            `}
          >
            <UserCircleIcon className="w-5 h-5" />
            {t('admin.storage.tab.user') || 'User Storage (Hub)'}
          </button>

          <button
            onClick={() => setMainTab('project')}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
              ${
                mainTab === 'project'
                  ? 'bg-white dark:bg-gray-700 text-violet-600 dark:text-violet-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }
            `}
          >
            <CubeIcon className="w-5 h-5" />
            {t('admin.storage.tab.project') || 'Project Storage (PVC)'}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="animate-in fade-in duration-300">
        {mainTab === 'user' ? (
          // Container for User Storage Management
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
            <UserStorageManagement />
          </div>
        ) : (
          // Container for Project Storage Management (Legacy PVC Admin)
          <ProjectStorageManagement />
        )}
      </div>
    </div>
  );
};

export default StoragePage;
