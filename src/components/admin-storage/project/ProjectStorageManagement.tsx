// src/components/admin-storage/project/ProjectStorageManagement.tsx
import React, { useState } from 'react';
import { useTranslation } from '@tailadmin/utils';
import {
  ListBulletIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';

// Import sub-components
import ProjectStorageList from './ProjectStorageList';
import ProjectStorageCreate from './ProjectStorageCreate';

type TabKey = 'list' | 'create';

const ProjectStorageManagement: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>('list');
  
  // 增加 Refresh Trigger：當新增成功時，這個數字+1，通知 List 重新撈資料
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateSuccess = () => {
    setActiveTab('list');
    setRefreshTrigger(prev => prev + 1); // Trigger re-fetch in List
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      
      {/* Header / Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 px-6 pt-4 flex justify-between items-end">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('list')}
            className={`
              group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-all
              ${activeTab === 'list'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
              }
            `}
          >
            <ListBulletIcon className={`
              -ml-0.5 mr-2 h-5 w-5
              ${activeTab === 'list' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}
            `} />
            {t('admin.storage.project.tab.list')}
          </button>

          <button
            onClick={() => setActiveTab('create')}
            className={`
              group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-all
              ${activeTab === 'create'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
              }
            `}
          >
            <PlusCircleIcon className={`
              -ml-0.5 mr-2 h-5 w-5
              ${activeTab === 'create' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}
            `} />
            {t('admin.storage.project.tab.create')}
          </button>
        </nav>
      </div>

      {/* Content Area */}
      <div className="p-6">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {activeTab === 'list' ? (
            // 將 refreshTrigger 傳入
            <ProjectStorageList refreshTrigger={refreshTrigger} />
          ) : (
            // 傳入 onSuccess callback
            <ProjectStorageCreate 
              onCancel={() => setActiveTab('list')} 
              onSuccess={handleCreateSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectStorageManagement;