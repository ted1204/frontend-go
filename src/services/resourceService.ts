import { RESOURCES_URL, RESOURCE_BY_ID_URL, CONFIG_FILE_BY_ID_URL} from "../config/url";
import { ErrorResponse, MessageResponse } from "../response/response";
import { Resource } from "../interfaces/resource";

const fetchWithAuth = async (url: string, options: RequestInit) => {
  const token = localStorage.getItem("token");
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

export const getResourceById = async (id: number): Promise<Resource> => {
  try {
    const response = await fetchWithAuth(RESOURCE_BY_ID_URL(id), {
      method: "GET",
    });
    return response as Resource;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch resource.");
  }
};

export interface UpdateResourceInput {
  name?: string;
  type?: string;
  parsed_yaml?: string;
  description?: string;
}

export const updateResource = async (id: number, input: UpdateResourceInput): Promise<Resource> => {
  const formData = new FormData();
  if (input.name) formData.append("name", input.name);
  if (input.type) formData.append("type", input.type);
  if (input.parsed_yaml) formData.append("parsed_yaml", input.parsed_yaml);
  if (input.description) formData.append("description", input.description);

  try {
    const response = await fetchWithAuth(RESOURCE_BY_ID_URL(id), {
      method: "PUT",
      body: formData,
    });
    return response as Resource;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to update resource.");
  }
};

export const deleteResource = async (id: number): Promise<MessageResponse> => {
  try {
    const response = await fetchWithAuth(RESOURCE_BY_ID_URL(id), {
      method: "DELETE",
    });
    return response as MessageResponse;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to delete resource.");
  }
};

export const getResources = async (): Promise<Resource[]> => {
  try {
    const response = await fetchWithAuth(RESOURCES_URL, {
      method: "GET",
    });
    return response as Resource[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch resources.");
  }
};

export const getResourcesByConfigFile = async (cfId: number): Promise<Resource[]> => {
  try {
    const response = await fetchWithAuth(`${CONFIG_FILE_BY_ID_URL(cfId)}/resources`, { // 用你的 base URL 包裝
      method: "GET",
    });
    return response as Resource[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch resources by config file.");
  }
};