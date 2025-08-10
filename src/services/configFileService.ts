import { CONFIG_FILES_URL, CONFIG_FILE_BY_ID_URL, CONFIG_FILE_RESOURCES_URL } from "../config/url";

export interface ConfigFile {
  cfid: number;
  filename: string;
  minIOPath: string;
  projectID: number;
  createdAt: string;
}

export interface Resource {
  cf_id: number;
  r_id: number;
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
    "Content-Type": "multipart/form-data",
    Authorization: token ? `Bearer ${token}` : "",
  };
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }
  return response.json();
};

export const getConfigFiles = async (): Promise<ConfigFile[]> => {
  try {
    const response = await fetchWithAuth(CONFIG_FILES_URL, {
      method: "GET",
    });
    return response as ConfigFile[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch config files.");
  }
};

export interface CreateConfigFileInput {
  filename: string;
  raw_yaml: string;
  project_id: number;
}

export const createConfigFile = async (input: CreateConfigFileInput): Promise<ConfigFile> => {
  const formData = new FormData();
  formData.append("filename", input.filename);
  formData.append("raw_yaml", input.raw_yaml);
  formData.append("project_id", input.project_id.toString());

  try {
    const response = await fetchWithAuth(CONFIG_FILES_URL, {
      method: "POST",
      body: formData,
    });
    return response as ConfigFile;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to create config file.");
  }
};

export const getConfigFileById = async (id: number): Promise<ConfigFile> => {
  try {
    const response = await fetchWithAuth(CONFIG_FILE_BY_ID_URL(id), {
      method: "GET",
    });
    return response as ConfigFile;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch config file.");
  }
};

export interface UpdateConfigFileInput {
  filename?: string;
  raw_yaml?: string;
}

export const updateConfigFile = async (id: number, input: UpdateConfigFileInput): Promise<ConfigFile> => {
  const formData = new FormData();
  if (input.filename) formData.append("filename", input.filename);
  if (input.raw_yaml) formData.append("raw_yaml", input.raw_yaml);

  try {
    const response = await fetchWithAuth(CONFIG_FILE_BY_ID_URL(id), {
      method: "PUT",
      body: formData,
    });
    return response as ConfigFile;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to update config file.");
  }
};

export const deleteConfigFile = async (id: number): Promise<MessageResponse> => {
  try {
    const response = await fetchWithAuth(CONFIG_FILE_BY_ID_URL(id), {
      method: "DELETE",
    });
    return response as MessageResponse;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to delete config file.");
  }
};

export const getResourcesByConfigFile = async (id: number): Promise<Resource[]> => {
  try {
    const response = await fetchWithAuth(CONFIG_FILE_RESOURCES_URL(id), {
      method: "GET",
    });
    return response as Resource[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch resources.");
  }
};