import { useState, useRef, useEffect } from 'react';
import { ConfigFile } from '../interfaces/configFile';
import { Resource } from '../interfaces/resource';
import { getResourcesByConfigFile } from '../services/resourceService';

// --- Helper Components ---

// Chevron icon for the expand/collapse functionality
const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 transform text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

// The "More Actions" dropdown menu component (kebab menu)
// It is self-contained and handles its own state.
const MoreActionsButton = ({
  onEdit,
  onDelete,
  onDeleteInstance,
}: {
  onEdit: () => void;
  onDelete: () => void;
  onDeleteInstance: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // This effect handles closing the menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* The three-dot trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        aria-label="More actions"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {/* The dropdown panel */}
      {isOpen && (
        <div className="absolute right-0 top-full z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700">
          <button
            onClick={() => {
              onEdit();
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            編輯檔案
          </button>
          <button
            onClick={() => {
              onDeleteInstance();
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            銷毀實例
          </button>
          <div className="my-1 h-px bg-gray-100 dark:bg-gray-700" />
          <button
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/50"
          >
            刪除檔案
          </button>
        </div>
      )}
    </div>
  );
};

// --- Main Component Props ---
interface ConfigFileListProps {
  configFiles: ConfigFile[];
  onDelete: (id: number) => void;
  onEdit: (config: ConfigFile) => void;
  onCreateInstance: (id: number) => void;
  onDeleteInstance: (id: number) => void;
  actionLoading: boolean;
}

// --- Main Component ---
export default function ConfigFileList({
  configFiles,
  onDelete,
  onEdit,
  onCreateInstance,
  onDeleteInstance,
  actionLoading,
}: ConfigFileListProps) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [resources, setResources] = useState<Record<number, Resource[]>>({});
  const [loading, setLoading] = useState<Record<number, boolean>>({});

  const toggleExpand = async (cfId: number) => {
    const isOpen = !expanded[cfId];
    setExpanded((prev) => ({ ...prev, [cfId]: isOpen }));

    if (isOpen && !resources[cfId]) {
      setLoading((prev) => ({ ...prev, [cfId]: true }));
      try {
        const res = await getResourcesByConfigFile(cfId);
        setResources((prev) => ({ ...prev, [cfId]: res }));
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading((prev) => ({ ...prev, [cfId]: false }));
      }
    }
  };

  if (configFiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          找不到設定檔
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          點擊「新增設定檔」以開始。
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 dark:divide-gray-700 dark:border-gray-700">
      {configFiles.map((cf) => (
        <div key={cf.CFID} className="bg-white dark:bg-gray-800">
          {/* Main row for config file info and actions */}
          <div className="flex items-center p-4">
            {/* Expand button */}
            <button
              onClick={() => toggleExpand(cf.CFID)}
              className="mr-4 flex-shrink-0 rounded-md p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
              disabled={actionLoading}
              aria-label="Toggle resources"
            >
              <ChevronIcon isOpen={!!expanded[cf.CFID]} />
            </button>

            {/* File Info */}
            <div className="flex-grow">
              <p className="font-semibold text-gray-900 dark:text-white">
                {cf.Filename}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                ID: <span className="font-mono">{cf.CFID}</span> | 建立時間:{' '}
                {new Date(cf.CreatedAt).toLocaleDateString()}
              </p>
            </div>

            {/* Refined Action Area: Minimalist and Clean */}
            <div className="flex flex-shrink-0 items-center gap-4">
              {/* Primary Action: Deploy */}
              <button
                onClick={() => onCreateInstance(cf.CFID)}
                disabled={actionLoading}
                className="text-sm font-semibold text-blue-600 transition-colors hover:text-blue-800 disabled:cursor-not-allowed disabled:opacity-50 dark:text-blue-500 dark:hover:text-blue-400"
                title="部署實例"
              >
                部署
              </button>

              {/* Secondary Actions in a Dropdown */}
              <MoreActionsButton
                onEdit={() => onEdit(cf)}
                onDelete={() => onDelete(cf.CFID)}
                onDeleteInstance={() => onDeleteInstance(cf.CFID)}
              />
            </div>
          </div>

          {/* Expanded section for resources with a smooth transition */}
          <div
            className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${expanded[cf.CFID] ? 'max-h-96' : 'max-h-0'}`}
          >
            <div className="border-t border-gray-200 bg-gray-50/75 p-4 dark:border-gray-700 dark:bg-black/20 sm:px-6 sm:py-4">
              {loading[cf.CFID] ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse flex items-center justify-between"
                    >
                      <div className="h-4 w-2/5 rounded-md bg-gray-200 dark:bg-gray-700"></div>
                      <div className="h-5 w-1/5 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                  ))}
                </div>
              ) : resources[cf.CFID]?.length ? (
                <div>
                  <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    關聯資源
                  </h4>
                  <ul className="space-y-2">
                    {resources[cf.CFID].map((r) => (
                      <li
                        key={r.RID}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {r.Name}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                          {r.Type}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                  <p className="mt-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
                    無關聯資源
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    此設定檔尚未部署。
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
