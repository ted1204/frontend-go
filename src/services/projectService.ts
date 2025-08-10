import { PROJECTS_URL, PROJECT_BY_ID_URL, PROJECT_CONFIG_FILES_URL, PROJECT_RESOURCES_URL } from "../config/url";

export interface Project {
  PID: number;
  ProjectName: string;
  Description?: string;
  GID: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface ConfigFile {
  cfid: number;
  filename: string;
  minIOPath: string;
  projectID: number;
  createdAt: string;
}

export interface Resource {
  r_id: number;
  cf_id: number;
  name: string;
  type: string;
  description?: string;
  parsedYAML: object;
  create_at: string;
}

export interface ErrorResponse {
  error: string;
}

export interface MessageResponse {
  message: string;
}

const fetchWithAuth = async (url: string, options: RequestInit) => {
  const token = localStorage.getItem("token"); // 假設 token 存儲在 localStorage
  const headers = {
    ...options.headers,
    // "Content-Type": "multipart/form-data",
    Authorization: token ? `Bearer ${token}` : "",
  };
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }
  return response.json();
};

export const getProjects = async (): Promise<Project[]> => {
  try {
    const response = await fetchWithAuth(PROJECTS_URL, {
      method: "GET",
    });
    return response as Project[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch projects.");
  }
};

export interface CreateProjectInput {
  project_name: string;
  description?: string;
  g_id: number;
}

export const createProject = async (input: CreateProjectInput): Promise<Project> => {
  const formData = new FormData();
  formData.append("project_name", input.project_name);
  if (input.description) formData.append("description", input.description);
  formData.append("g_id", input.g_id.toString());

  try {
    const response = await fetchWithAuth(PROJECTS_URL, {
      method: "POST",
      body: formData,
    });
    return response as Project;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to create project.");
  }
};

export const getProjectById = async (id: number): Promise<Project> => {
  try {
    const response = await fetchWithAuth(PROJECT_BY_ID_URL(id), {
      method: "GET",
    });
    return response as Project;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch project.");
  }
};

export interface UpdateProjectInput {
  project_name?: string;
  description?: string;
  g_id?: number;
}

export const updateProject = async (id: number, input: UpdateProjectInput): Promise<Project> => {
  const formData = new FormData();
  if (input.project_name) formData.append("project_name", input.project_name);
  if (input.description) formData.append("description", input.description);
  if (input.g_id) formData.append("g_id", input.g_id.toString());

  try {
    const response = await fetchWithAuth(PROJECT_BY_ID_URL(id), {
      method: "PUT",
      body: formData,
    });
    return response as Project;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to update project.");
  }
};

export const deleteProject = async (id: number): Promise<MessageResponse> => {
  try {
    const response = await fetchWithAuth(PROJECT_BY_ID_URL(id), {
      method: "DELETE",
    });
    return response as MessageResponse;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to delete project.");
  }
};

export const getConfigFilesByProject = async (id: number): Promise<ConfigFile[]> => {
  try {
    const response = await fetchWithAuth(PROJECT_CONFIG_FILES_URL(id), {
      method: "GET",
    });
    return response as ConfigFile[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch config files.");
  }
};

export const getResourcesByProject = async (id: number): Promise<Resource[]> => {
  try {
    const response = await fetchWithAuth(PROJECT_RESOURCES_URL(id), {
      method: "GET",
    });
    return response as Resource[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch resources.");
  }
};