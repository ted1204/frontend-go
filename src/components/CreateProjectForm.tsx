// src/components/CreateProjectForm.tsx

import React, { ChangeEvent, FormEvent, useState, useEffect, useRef } from 'react';
import { useTranslation } from '@nthucscc/utils';

// Assuming InputField and Button are properly defined components
import InputField from './form/input/InputField';
import Button from './ui/button/Button';

// --- Conceptual Interface for Group Data (Must be defined in your app) ---
interface GroupOption {
  GID: number;
  GroupName: string;
}
// ------------------------------------------------------------------------

// SVG Components (Used for consistency and minimal style)
const SpinnerIcon = ({ className = 'w-4 h-4' }) => (
  <svg
    className={`animate-spin ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);
const AlertIcon = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.398 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

interface CreateProjectFormProps {
  projectName: string;
  description: string;
  groupId: number;
  gpuQuota: number;
  gpuAccess: string[];
  mpsLimit: number;
  mpsMemory: number;
  loading: boolean;
  error: string | null;
  isOpen: boolean;
  onClose: () => void;
  onProjectNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onGpuQuotaChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onGpuAccessChange: (access: string) => void;
  onMpsLimitChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onMpsMemoryChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onGroupIdChange: (e: ChangeEvent<HTMLInputElement>) => void; // Kept for compatibility
  onSubmit: (e: FormEvent) => void;

  // NEW SEARCH-SELECT PROPS
  availableGroups: GroupOption[];
  selectedGroupName: string;
  onSelectedGroupChange: (groupId: number, groupName: string) => void;
}

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({
  projectName,
  description,
  groupId,
  gpuQuota,
  gpuAccess,
  mpsLimit,
  mpsMemory,
  loading,
  error,
  isOpen,
  onClose,
  onProjectNameChange,
  onDescriptionChange,
  onGpuQuotaChange,
  onGpuAccessChange,
  onMpsLimitChange,
  onMpsMemoryChange,
  onSubmit,

  availableGroups,
  selectedGroupName,
  onSelectedGroupChange,
}) => {
  const { t } = useTranslation();
  // --- Local State for Search Dropdown ---
  const [searchTerm, setSearchTerm] = useState(selectedGroupName);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // FIX: Defensive initialization of availableGroups
  const safeGroups = availableGroups || [];

  // Filter logic runs whenever local search term changes
  const filteredGroups = safeGroups.filter((group) =>
    group.GroupName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Synchronize local search term with external selectedGroupName
  useEffect(() => {
    setSearchTerm(selectedGroupName);
  }, [selectedGroupName]);

  // Handles group selection from the dropdown
  const handleSelectGroup = (group: GroupOption) => {
    onSelectedGroupChange(group.GID, group.GroupName);
    setIsDropdownOpen(false);
  };

  // Handles input change in the search field
  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsDropdownOpen(true);

    // Clear selected group in parent if user starts typing a new name
    if (value !== selectedGroupName) {
      onSelectedGroupChange(0, value); // Pass 0 for ID and the new text for name
    }
  };

  // Logic to close dropdown when clicking outside of the search area
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        // If nothing was selected, reset search input to the selected name
        setSearchTerm(selectedGroupName);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedGroupName]);

  // --- Modal Animation Logic (FIXED: Eliminates flash by using dedicated render state) ---
  const [shouldRender, setShouldRender] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }

    if (isOpen) {
      setShouldRender(true);
      // Use requestAnimationFrame to safely apply fade-in class on the next tick
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimationClass('fade-in-0');
        });
      });
    } else if (shouldRender) {
      setAnimationClass('fade-out-0');

      // Wait 300ms for the animation to complete before unmounting
      animationTimeoutRef.current = setTimeout(() => {
        setShouldRender(false);
        setAnimationClass('');
        onClose();
      }, 300);
    }

    // Cleanup function: Ensures timers are cleared when the component is unmounted or effect reruns
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [isOpen, shouldRender, onClose]);

  if (!shouldRender) {
    return null;
  }
  // -----------------------------------------------------------------------

  return (
    // Modal Backdrop: Apply dynamic animation class directly. No click-to-close on background.
    <div
      className={`fixed inset-0 bg-gray-900 bg-opacity-50 dark:bg-opacity-50 flex items-center justify-center z-50 p-4 ${animationClass}`}
    >
      {/* Modal Content Card: Main form container. */}
      <div
        className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl relative"
        onClick={(e) => e.stopPropagation()} // Prevent accidental closure
      >
        <div className="p-8">
          {/* Close Button (Top Right X) */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-white transition duration-200"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>

          <h3 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white text-center">
            {t('project.create.title')}
          </h3>

          {error && (
            <p className="mb-4 p-3 flex items-start bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 rounded-md text-sm font-medium">
              <AlertIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-red-500 dark:text-red-400" />
              <span className="text-left text-xs">
                {t('project.create.error')}: {error}
              </span>
            </p>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              <InputField
                type="text"
                label={t('project.create.name')}
                value={projectName}
                onChange={onProjectNameChange}
                required
                placeholder={t('project.create.namePlaceholder')}
                className="w-full"
                disabled={loading}
              />

              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="description-textarea"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {t('project.create.description')}
                </label>
                <textarea
                  id="description-textarea"
                  value={description}
                  onChange={onDescriptionChange}
                  rows={4}
                  placeholder={t('project.create.descriptionPlaceholder')}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-md shadow-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 disabled:bg-gray-100 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                type="number"
                label={t('project.create.gpuQuota')}
                value={gpuQuota}
                onChange={onGpuQuotaChange}
                placeholder={t('project.create.gpuQuotaPlaceholder')}
                className="w-full"
                min="0"
                disabled={loading}
              />

              <InputField
                type="number"
                label={t('project.create.gpuThreadLimit')}
                value={mpsLimit}
                onChange={onMpsLimitChange}
                placeholder={t('project.create.gpuThreadLimitPlaceholder')}
                className="w-full"
                min="0"
                max="100"
                disabled={loading}
              />

              <InputField
                type="number"
                label={t('project.create.gpuMemoryLimit')}
                value={mpsMemory}
                onChange={onMpsMemoryChange}
                placeholder={t('project.create.gpuMemoryLimitPlaceholder')}
                className="w-full"
                min="0"
                disabled={loading}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('project.create.gpuAccessMode')}
                </div>
                <div className="text-xs text-gray-500">{t('project.create.mpsSettings')}</div>
              </div>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gpuAccess.includes('shared')}
                    onChange={() => onGpuAccessChange('shared')}
                    className="form-checkbox h-5 w-5 text-violet-600 rounded border-gray-300 focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-700"
                    disabled={loading}
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    {t('project.create.gpuAccessShared')}
                  </span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gpuAccess.includes('dedicated')}
                    onChange={() => onGpuAccessChange('dedicated')}
                    className="form-checkbox h-5 w-5 text-violet-600 rounded border-gray-300 focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-700"
                    disabled={loading}
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    {t('project.create.gpuAccessDedicated')}
                  </span>
                </label>
              </div>
            </div>

            {gpuAccess.includes('shared') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700">
                <InputField
                  type="number"
                  label={t('project.create.mpsThreadLimit')}
                  value={mpsLimit}
                  onChange={onMpsLimitChange}
                  placeholder="100"
                  className="w-full"
                  min="0"
                  max="100"
                  disabled={loading}
                />
                <InputField
                  type="number"
                  label={t('project.create.mpsMemoryLimit')}
                  value={mpsMemory}
                  onChange={onMpsMemoryChange}
                  placeholder="0 (無限制)"
                  className="w-full"
                  min="0"
                  disabled={loading}
                />
              </div>
            )}

            <div className="space-y-1.5 text-left relative" ref={dropdownRef}>
              <InputField
                type="text"
                id="group-search"
                label={t('project.create.group')}
                value={searchTerm}
                onChange={handleSearchInputChange}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder={t('project.create.groupPlaceholder')}
                className="w-full"
                required
                disabled={loading}
                style={{ borderColor: groupId > 0 ? '#4f46e5' : undefined }}
              />

              {isDropdownOpen && (
                <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredGroups.length > 0 ? (
                    filteredGroups.map((group) => (
                      <li
                        key={group.GID}
                        onClick={() => handleSelectGroup(group)}
                        className="px-4 py-2 cursor-pointer text-gray-800 dark:text-gray-200 hover:bg-violet-100 dark:hover:bg-violet-800 transition duration-100"
                      >
                        {group.GroupName}
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          (ID: {group.GID})
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-500 dark:text-gray-400">
                      {t('project.create.noGroupsFound')}
                    </li>
                  )}
                </ul>
              )}

              {groupId > 0 && (
                <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                  {t('project.create.selectedId')} {groupId}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-2.5 text-base font-semibold bg-white text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 transition duration-150 disabled:opacity-50"
                disabled={loading}
              >
                {t('project.create.cancel')}
              </Button>
              <Button
                type="submit"
                className="flex-1 px-6 py-2.5 text-base font-semibold bg-violet-600 text-white rounded-md hover:bg-violet-700 transition duration-150 focus:outline-none focus:ring-4 focus:ring-violet-500 focus:ring-opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={loading || groupId === 0}
              >
                {loading ? (
                  <span className="flex items-center justify-center animate-pulse">
                    <SpinnerIcon className="w-4 h-4 mr-2 text-white" />
                    {t('project.create.creating')}
                  </span>
                ) : (
                  t('project.create.submit')
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectForm;
