import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PageMeta from "./common/PageMeta";
import PageBreadcrumb from "./common/PageBreadCrumb";
import { Project } from "../interfaces/project";
import { getProjectById } from "../services/projectService";
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
} from "../services/configFileService";
import AddConfigModal from "../components/AddConfigModal";
import ConfigFileList from "../components/ConfigFileList";
import EditConfigModal from "../components/EditConfigModal";
import useWebSocket from "../hooks/useWebSocket";
import MonitoringPanel from "./MonitoringPanel";
import { ConfigFile } from "../interfaces/configFile";
import Button from "./ui/button/Button"

interface FormData {
  filename: string;
  raw_yaml: string;
}

export default function ProjectDetail() {
  const { id } = useParams<{ id?: string }>();
  if (!id) throw new Error("Project ID is required");
  const token = localStorage.getItem("token") || "";
  const messages = useWebSocket(id, token);
  const [project, setProject] = useState<Project | null>(null);
  const [configFiles, setConfigFiles] = useState<ConfigFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<ConfigFile | null>(null);
  const [formData, setFormData] = useState<FormData>({ filename: "", raw_yaml: "" });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
  }, [messages]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const projectData = await getProjectById(parseInt(id));
        setProject(projectData);
        const configData = await getConfigFilesByProjectId(parseInt(id));
        setConfigFiles(configData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch project or config files");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleCreate = async (data: FormData) => {
    setActionLoading(true);
    try {
      await createConfigFile({ ...data, project_id: parseInt(id) });
      setIsCreateModalOpen(false);
      const updated = await getConfigFilesByProjectId(parseInt(id));
      setConfigFiles(updated);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create config file");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (data: FormData) => {
    if (!selectedConfig) return;
    setActionLoading(true);
    try {
      await updateConfigFile(selectedConfig.CFID, { filename: data.filename || selectedConfig.Filename });
      setIsEditModalOpen(false);
      setSelectedConfig(null);
      setFormData({ filename: "", raw_yaml: "" });
      const updated = await getConfigFilesByProjectId(parseInt(id));
      setConfigFiles(updated);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update config file");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (configId: number) => {
    if (confirm("Are you sure?")) {
      setActionLoading(true);
      try {
        await deleteConfigFile(configId);
        const updated = await getConfigFilesByProjectId(parseInt(id)); // Fixed param to parseInt(id)
        setConfigFiles(updated);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete config file");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleCreateInstance = async (id: number) => {
    setActionLoading(true);
    try {
      await createInstance(id);
      alert("Instance created, check K8s status");
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create instance");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteInstance = async (id: number) => {
    if (confirm("Destruct instance?")) {
      setActionLoading(true);
      try {
        await deleteInstance(id);
        alert("Instance destructed");
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to destruct instance");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleEdit = (config: ConfigFile) => {
    setSelectedConfig(config);
    setFormData({ filename: config.Filename, raw_yaml: "" });
    setIsEditModalOpen(true);
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!project) return <p className="text-gray-500">Project not found.</p>;

  return (
    <div>
      <PageMeta
        title={`React.js Project ${project.ProjectName} | TailAdmin`}
        description={`Details for project ${project.ProjectName}`}
      />
      <PageBreadcrumb pageTitle={project.ProjectName} />

      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
          Project Details
        </h3>
        <div className="space-y-2">
          <p className="text-gray-800 dark:text-white/90"><strong>ID:</strong> {project.PID}</p>
          <p className="text-gray-800 dark:text-white/90"><strong>Name:</strong> {project.ProjectName}</p>
          <p className="text-gray-800 dark:text-white/90"><strong>Description:</strong> {project.Description || "N/A"}</p>
          <p className="text-gray-800 dark:text-white/90"><strong>Group ID:</strong> {project.GID}</p>
          <p className="text-gray-800 dark:text-white/90"><strong>Created At:</strong> {project.CreatedAt}</p>
          <p className="text-gray-800 dark:text-white/90"><strong>Updated At:</strong> {project.UpdatedAt}</p>
        </div>
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">Config Files</h4>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={actionLoading}
            >
              {actionLoading ? "Adding..." : "Add ConfigFile"}
            </Button>
          </div>
          <ConfigFileList
            configFiles={configFiles}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onCreateInstance={handleCreateInstance}
            onDeleteInstance={handleDeleteInstance}
            actionLoading={actionLoading}
          />
          <MonitoringPanel messages={messages} />
        </div>
      </div>

      <AddConfigModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreate}
        actionLoading={actionLoading}
      />

      <EditConfigModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setSelectedConfig(null); setFormData({ filename: "", raw_yaml: "" }); }}
        onSave={handleUpdate}
        selectedConfig={selectedConfig}
        actionLoading={actionLoading}
      />
    </div>
  );
}