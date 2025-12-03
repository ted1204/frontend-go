import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageMeta from './common/PageMeta';
import PageBreadcrumb from './common/PageBreadCrumb';
import { Project } from '../interfaces/project';
import { getProjectById } from '../services/projectService';
import {
  getConfigFilesByProjectId,
  createConfigFile,
  getConfigFileById,
  updateConfigFile,
  deleteConfigFile,
  createInstance,
  deleteInstance,
  CreateConfigFileInput,
  UpdateConfigFileInput,
} from '../services/configFileService';
import AddConfigModal from './AddConfigModal';
import ConfigFileList from './ConfigFileList';
import EditConfigModal from './EditConfigModal';
import useWebSocket from '../hooks/useWebSocket';
import MonitoringPanel from './MonitoringPanel';
import { ConfigFile } from '../interfaces/configFile';
import Button from './ui/button/Button';

// Helper component for the initial page loading state (Skeleton)
const PageSkeleton = () => (
  <div className="animate-pulse">
    {/* Breadcrumb Skeleton */}
    <div className="mb-6 h-8 w-1/3 rounded-md bg-gray-200 dark:bg-gray-700"></div>
    {/* Single-column grid for all screens */}
    <div className="grid grid-cols-1 gap-8">
      {/* Monitoring Panel Skeleton */}
      <div className="col-span-full">
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 h-8 w-3/4 rounded-md bg-gray-300 dark:bg-gray-600"></div>
          <div className="h-40 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
      {/* Main Content Skeleton (Project Details and Config Files) */}
      <div className="space-y-8 col-span-full">
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 h-8 w-1/2 rounded-md bg-gray-300 dark:bg-gray-600"></div>
          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 h-8 w-1/3 rounded-md bg-gray-300 dark:bg-gray-600"></div>
          <div className="h-10 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    </div>
  </div>
);

// Helper for displaying error or not found states
const StateDisplay = ({
  title,
  message,
}: {
  title: string;
  message: string;
}) => (
  <div className="flex h-96 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 text-center dark:border-gray-700 dark:bg-gray-800">
    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
      {title}
    </h3>
    <p className="mt-2 text-gray-500 dark:text-gray-400">{message}</p>
  </div>
);

export default function ProjectDetail() {
  const { id } = useParams<{ id?: string }>();
  if (!id) throw new Error('Project ID is required');

  // State management remains largely the same
  const messages = useWebSocket(id);
  const [project, setProject] = useState<Project | null>(null);
  const [configFiles, setConfigFiles] = useState<ConfigFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<ConfigFile | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Data fetching logic remains the same, fetching Project and Config Files in parallel
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const projectId = parseInt(id);
        const [projectData, configData] = await Promise.all([
          getProjectById(projectId),
          getConfigFilesByProjectId(projectId),
        ]);
        setProject(projectData);
        setConfigFiles(configData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Handler functions for CRUD operations
  const handleCreate = async (data: { filename: string; raw_yaml: string }) => {
    setActionLoading(true);
    try {
      await createConfigFile({ ...data, project_id: parseInt(id) });
      setIsCreateModalOpen(false);
      const updated = await getConfigFilesByProjectId(parseInt(id));
      setConfigFiles(updated);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create config file'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (data: { filename: string; raw_yaml: string }) => {
    if (!selectedConfig) return;
    setActionLoading(true);
    try {
      await updateConfigFile(selectedConfig.CFID, {
        filename: data.filename || selectedConfig.Filename,
        raw_yaml: data.raw_yaml || selectedConfig.Content,
      });
      setIsEditModalOpen(false);
      const updated = await getConfigFilesByProjectId(parseInt(id));
      setConfigFiles(updated);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update config file'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (configId: number) => {
    if (confirm('Are you sure?')) {
      setActionLoading(true);
      try {
        await deleteConfigFile(configId);
        const updated = await getConfigFilesByProjectId(parseInt(id));
        setConfigFiles(updated);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to delete config file'
        );
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Handler for creating an instance from a config file
  const handleCreateInstance = async (id: number) => {
    setActionLoading(true);
    try {
      await createInstance(id);
      alert('Instance creation request sent. Check status.');
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create instance'
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Handler for deleting an instance
  const handleDeleteInstance = async (id: number) => {
    if (confirm('Are you sure you want to delete this instance?')) {
      setActionLoading(true);
      try {
        await deleteInstance(id);
        alert('Instance deletion request sent.');
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to delete instance'
        );
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Prepares the config file data for the Edit Modal
  const handleEdit = (config: ConfigFile) => {
    setSelectedConfig(config);
    setIsEditModalOpen(true);
  };

  // Render loading skeleton first
  if (loading) return <PageSkeleton />;

  // Render error or not found states
  if (error) return <StateDisplay title="An Error Occurred" message={error} />;
  if (!project)
    return (
      <StateDisplay
        title="Project Not Found"
        message={`Could not find a project with ID ${id}.`}
      />
    );

  return (
    <div>
      <PageMeta
        title={`${project.ProjectName} | Project Details`}
        description={`Details and configuration for project ${project.ProjectName}`}
      />
      <PageBreadcrumb pageTitle={project.ProjectName} />

      {/* Main single-column layout */}
      {/* Sets up a single-column grid with gap-8 */}
      {/* 1. Main Content (Project Details Card & Config Files Section - Placed second and spans full width) */}
      <div className="flex flex-col gap-8 col-span-full">
        {/* Project Details Card - Enhanced Version */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
            <div className="flex items-center gap-4">
              {/* Project Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {project.ProjectName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Project Information
                </p>
              </div>
            </div>
            {/* Action Button (e.g., Settings) */}
            <button className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.982.54 2.295 0 3.277-1.139 2.067 2.022 4.11 2.973a1.532 1.532 0 013.277 0c2.088 1.137 5.249-.906 4.11-2.973a1.532 1.532 0 010-3.277c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.286-.948zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Card Body */}
          <div className="p-6">
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              {project.Description || 'No description provided.'}
            </p>

            {/* Divider */}
            <hr className="mb-6 border-gray-200 dark:border-gray-700" />

            {/* Metadata Grid */}
            <dl className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
              {/* Project ID */}
              <div className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 flex-shrink-0 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Project ID
                  </dt>
                  <dd className="mt-1 font-mono text-sm text-gray-900 dark:text-white">
                    {project.PID}
                  </dd>
                </div>
              </div>

              {/* Group ID as a Badge */}
              <div className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 flex-shrink-0 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Group
                  </dt>
                  <dd className="mt-1">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                      ID: {project.GID}
                    </span>
                  </dd>
                </div>
              </div>

              {/* Created At */}
              <div className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 flex-shrink-0 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Created At
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {new Date(project.CreatedAt).toLocaleString()}
                  </dd>
                </div>
              </div>

              {/* Last Updated */}
              <div className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 flex-shrink-0 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h5M23 18v-5h-5m-4-1V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v4h-4a1 1 0 00-1 1v4a1 1 0 001 1h4v4a1 1 0 001 1h4a1 1 0 001-1v-4h4a1 1 0 001-1v-4a1 1 0 00-1-1h-4z"
                  />
                </svg>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Last Updated
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {new Date(project.UpdatedAt).toLocaleString()}
                  </dd>
                </div>
              </div>
            </dl>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-8">
          {/* 2. Live Monitoring Panel (Now placed first and spans the full width) */}
          <div className="col-span-full">
            {/* Removed 'sticky' class for a better flow in single-column layout */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700/50 dark:bg-gray-800/60 backdrop-blur-lg">
              <div className="flex items-center gap-4 border-b border-gray-900/10 pb-4 dark:border-gray-50/10">
                <div className="grid h-10 w-10 flex-shrink-0 place-content-center rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900">
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
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Live Monitoring
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Real-time logs and status updates.
                  </p>
                </div>
              </div>
              <MonitoringPanel messages={messages} />
            </div>
          </div>

          {/* Config Files Section - Placed last in the single column */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4 sm:p-6 dark:border-gray-600">
              <div>
                <h3 className="text-lg font-bold leading-6 text-gray-900 dark:text-white">
                  Configuration Files
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                  Manage, edit, and deploy your YAML configurations.
                </p>
              </div>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                disabled={actionLoading}
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-md border border-gray-300 bg-white
                  px-3 py-2 text-sm font-semibold text-gray-800
                  shadow-sm                             // Subtle shadow
                  transition-all duration-150           // Smooth transition
                  hover:bg-gray-50                      // Hover effect in light mode
                  dark:border-gray-600 dark:bg-gray-700 // Dark mode border and background
                  dark:text-gray-200                    // Dark mode text color
                  dark:hover:bg-gray-600                // Dark mode hover effect
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 // Focus state
                  disabled:cursor-not-allowed disabled:opacity-50    // Disabled state
                  dark:focus:ring-offset-gray-800
                "
              >
                {/* Plus Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {actionLoading ? 'Processing...' : 'Add Config'}
              </Button>
            </div>

            {/* Card Body containing the list */}
            <div className="p-4 sm:p-6">
              <ConfigFileList
                configFiles={configFiles}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onCreateInstance={handleCreateInstance}
                onDeleteInstance={handleDeleteInstance}
                actionLoading={actionLoading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals remain the same */}
      <AddConfigModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreate}
        actionLoading={actionLoading}
      />
      <EditConfigModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdate}
        selectedConfig={selectedConfig}
        actionLoading={actionLoading}
      />
    </div>
  );
}
