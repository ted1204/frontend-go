import {
  PROJECTS_URL,
  PROJECT_BY_ID_URL,
  PROJECT_CONFIG_FILES_URL,
  PROJECT_RESOURCES_URL,
} from '../config/url';
import { MessageResponse } from '../response/response'; // Adjust the import path as necessary
import { Project } from '../interfaces/project';
import { ConfigFile } from '../interfaces/configFile'; // Adjust the import path as necessary
import { Resource } from '../interfaces/resource'; // Adjust the import path as necessary
import { fetchWithAuth } from '../utils/api';

export const getProjects = async (): Promise<Project[]> => {
  try {
    const response = await fetchWithAuth(PROJECTS_URL, {
      method: 'GET',
    });
    return response as Project[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch projects.');
  }
};

export interface CreateProjectDTO {
  project_name: string;
  description?: string;
  g_id: number;
  gpu_quota?: number;
  gpu_access?: string;
  mps_limit?: number;
  mps_memory?: number;
}

export const createProject = async (input: CreateProjectDTO): Promise<Project> => {
  const formData = new FormData();
  formData.append('project_name', input.project_name);
  formData.append('g_id', input.g_id.toString());
  if (input.description) formData.append('description', input.description);
  if (input.gpu_quota !== undefined) formData.append('gpu_quota', input.gpu_quota.toString());
  if (input.gpu_access) formData.append('gpu_access', input.gpu_access);
  if (input.mps_limit) formData.append('mps_limit', input.mps_limit.toString());
  if (input.mps_memory) formData.append('mps_memory', input.mps_memory.toString());

  try {
    const response = await fetchWithAuth(PROJECTS_URL, {
      method: 'POST',
      body: formData,
    });
    return response as Project;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create group.');
  }
};

export const getProjectById = async (id: number): Promise<Project> => {
  try {
    const response = await fetchWithAuth(PROJECT_BY_ID_URL(id), {
      method: 'GET',
    });
    return response as Project;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch project.');
  }
};

export interface UpdateProjectInput {
  project_name?: string;
  description?: string;
  g_id?: number;
  gpu_quota?: number;
  gpu_access?: string;
  mps_limit?: number;
  mps_memory?: number;
}

export const updateProject = async (id: number, input: UpdateProjectInput): Promise<Project> => {
  const formData = new FormData();
  if (input.project_name) formData.append('project_name', input.project_name);
  if (input.description) formData.append('description', input.description);
  if (input.g_id) formData.append('g_id', input.g_id.toString());
  if (input.gpu_quota !== undefined) formData.append('gpu_quota', input.gpu_quota.toString());
  if (input.gpu_access) formData.append('gpu_access', input.gpu_access);
  if (input.mps_limit) formData.append('mps_limit', input.mps_limit.toString());
  if (input.mps_memory) formData.append('mps_memory', input.mps_memory.toString());

  try {
    const response = await fetchWithAuth(PROJECT_BY_ID_URL(id), {
      method: 'PUT',
      body: formData,
    });
    return response as Project;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update project.');
  }
};

export const deleteProject = async (id: number): Promise<MessageResponse> => {
  try {
    const response = await fetchWithAuth(PROJECT_BY_ID_URL(id), {
      method: 'DELETE',
    });
    return response as MessageResponse;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete project.');
  }
};

export const getConfigFilesByProject = async (id: number): Promise<ConfigFile[]> => {
  try {
    const response = await fetchWithAuth(PROJECT_CONFIG_FILES_URL(id), {
      method: 'GET',
    });
    return response as ConfigFile[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch config files.');
  }
};

export const getResourcesByProject = async (id: number): Promise<Resource[]> => {
  try {
    const response = await fetchWithAuth(PROJECT_RESOURCES_URL(id), {
      method: 'GET',
    });
    return response as Resource[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch resources.');
  }
};
