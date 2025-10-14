// src/components/GroupList.tsx

import React from 'react';
import { Group } from '../interfaces/group'; // Adjust import based on your structure

// --- Interfaces --- //

interface GroupListProps {
  groups: Group[];
  loading: boolean;
  error: string | null;
  onGroupClick: (groupId: number) => void;
  onDeleteGroup: (groupId: number) => void;
}

// --- Helper Components for States --- //

/**
 * A spinner component for the loading state.
 */
const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center p-16">
    <svg
      className="animate-spin h-8 w-8 text-blue-500"
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
    <span className="ml-4 text-gray-500 dark:text-gray-400">
      Loading Groups...
    </span>
  </div>
);

/**
 * An alert component to display errors.
 * @param message - The error message to display.
 */
const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
  <div
    className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg"
    role="alert"
  >
    <strong className="font-bold">Oops! </strong>
    <span className="block sm:inline">{message}</span>
  </div>
);

/**
 * A component for the empty state when no groups are found.
 */
const EmptyState: React.FC = () => (
  <div className="text-center py-16 px-6">
    <svg
      className="mx-auto h-12 w-12 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
    <h3 className="mt-2 text-lg font-semibold text-gray-800 dark:text-white">
      No Groups Found
    </h3>
    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
      Get started by creating a new group.
    </p>
  </div>
);

// --- Main Component --- //

/**
 * Displays a list of groups with loading, error, and empty states.
 * Allows users to click to view details or delete a group.
 */
const GroupList: React.FC<GroupListProps> = ({
  groups,
  loading,
  error,
  onGroupClick,
  onDeleteGroup,
}) => {
  // Render content based on the current state
  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }
    if (error) {
      return <ErrorDisplay message={error} />;
    }
    if (groups.length === 0) {
      return <EmptyState />;
    }
    return (
      <ul className="space-y-3">
        {groups.map((group) => (
          <li
            key={group.GID}
            className="group flex justify-between items-center bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500"
          >
            {/* Clickable area for group details */}
            <div
              onClick={() => onGroupClick(group.GID)}
              className="flex-grow cursor-pointer px-4 py-3"
            >
              <div className="flex items-center gap-3">
                {/* A decorative icon */}
                <div className="hidden sm:flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.028.658a.78.78 0 01-.357.442zM20 9a3 3 0 100-6 3 3 0 000 6zM14 8a2 2 0 11-4 0 2 2 0 014 0zm5.51 7.326a.78.78 0 01-.358-.442 3 3 0 01-4.308-3.516 6.484 6.484 0 001.905 3.959c.023.222.014.442-.028.658a.78.78 0 01.357.442zM9.25 12.164a4.5 4.5 0 00-5.462-3.332 6.49 6.49 0 00-1.905 3.959c-.023.222-.014.442.028.658a.78.78 0 00.358.442 4.5 4.5 0 005.462-3.332zM14.75 12.164a4.5 4.5 0 015.462-3.332 6.49 6.49 0 011.905 3.959c.023.222.014.442-.028.658a.78.78 0 01-.358.442 4.5 4.5 0 01-5.462-3.332z" />
                  </svg>
                </div>
                {/* Group details */}
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white truncate">
                    {group.GroupName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {group.Description || `ID: ${group.GID}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Delete button */}
            <div className="px-4">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent onGroupClick from firing
                  onDeleteGroup(group.GID);
                }}
                className="p-2 rounded-full text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                aria-label="Delete group"
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          Your Groups
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Select a group to view its members or create a new one.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-4 sm:p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default GroupList;
