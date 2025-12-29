// import React, { useState } from 'react';
// import { useTranslation } from '@tailadmin/utils';

// // Icons
// import {
//   ListBulletIcon,
//   PlusCircleIcon,
//   ArrowsPointingOutIcon,
//   TrashIcon,
// } from '@heroicons/react/24/outline';

// // Sub-components (Legacy structure)
// // import PVCList from '../admin-pvc/PVCList';
// // import PVCCreate from '../admin-pvc/PVCCreate';
// // import PVCExpand from '../admin-pvc/PVCExpand';
// // import PVCDelete from '../admin-pvc/PVCDelete';

// type TabKey = 'list' | 'create' | 'expand' | 'delete';

// interface TabConfig {
//   key: TabKey;
//   labelKey: string;
//   icon: React.ElementType;
//   Component: React.FC;
//   colorClass?: string;
// }

// const ProjectStorageManagement: React.FC = () => {
//   const { t } = useTranslation();
//   const [activeTab, setActiveTab] = useState<TabKey>('list');

//   const tabs: TabConfig[] = [
//     {
//       key: 'list',
//       labelKey: 'admin.pvc.tab.list',
//       icon: ListBulletIcon,
//       Component: PVCList,
//     },
//     {
//       key: 'create',
//       labelKey: 'admin.pvc.tab.create',
//       icon: PlusCircleIcon,
//       Component: PVCCreate,
//     },
//     {
//       key: 'expand',
//       labelKey: 'admin.pvc.tab.expand',
//       icon: ArrowsPointingOutIcon,
//       Component: PVCExpand,
//     },
//     {
//       key: 'delete',
//       labelKey: 'admin.pvc.tab.delete',
//       icon: TrashIcon,
//       Component: PVCDelete,
//       colorClass:
//         'hover:text-red-600 data-[active=true]:text-red-600 data-[active=true]:border-red-600',
//     },
//   ];

//   return (
//     <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
//       {/* Internal Tab Navigation */}
//       <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 px-2 pt-2">
//         <nav className="-mb-px flex space-x-4" aria-label="Tabs">
//           {tabs.map((tab) => {
//             const isActive = activeTab === tab.key;
//             return (
//               <button
//                 key={tab.key}
//                 onClick={() => setActiveTab(tab.key)}
//                 data-active={isActive}
//                 className={`
//                   group inline-flex items-center px-4 py-3 border-b-2 font-medium text-sm transition-all duration-200 ease-in-out
//                   ${
//                     isActive
//                       ? 'border-violet-600 text-violet-600 dark:text-violet-400 bg-white dark:bg-gray-800 rounded-t-lg shadow-sm'
//                       : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
//                   }
//                   ${tab.colorClass || ''}
//                 `}
//               >
//                 <tab.icon
//                   className={`
//                     -ml-0.5 mr-2 h-5 w-5 transition-colors duration-200
//                     ${
//                       isActive
//                         ? 'text-violet-600 dark:text-violet-400'
//                         : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500'
//                     }
//                     ${tab.key === 'delete' && isActive ? '!text-red-600' : ''}
//                     ${tab.key === 'delete' && !isActive ? 'group-hover:text-red-500' : ''}
//                   `}
//                   aria-hidden="true"
//                 />
//                 {t(tab.labelKey)}
//               </button>
//             );
//           })}
//         </nav>
//       </div>

//       {/* Tab Content Area */}
//       <div className="p-6 sm:p-8 min-h-[500px]">
//         {tabs.map((tab) => {
//           if (activeTab !== tab.key) return null;
//           return (
//             <div key={tab.key} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
//               <tab.Component />
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default ProjectStorageManagement;
