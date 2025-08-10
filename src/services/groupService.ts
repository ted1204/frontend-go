import { GROUPS_URL, GROUP_BY_ID_URL } from "../config/url";

export interface Group {
  GID: number;
  GroupName: string;
  Description?: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface ErrorResponse {
  error: string;
}

export interface MessageResponse {
  message: string;
}

const fetchWithAuth = async (url: string, options: RequestInit) => {
  const token = localStorage.getItem("token");
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

export const getGroups = async (): Promise<Group[]> => {
  try {
    const response = await fetchWithAuth(GROUPS_URL, {
      method: "GET",
    });
    return response as Group[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch groups.");
  }
};

export interface CreateGroupInput {
  group_name: string;
  description?: string;
}

export const createGroup = async (input: CreateGroupInput): Promise<Group> => {
  const formData = new FormData();
  formData.append("group_name", input.group_name);
  if (input.description) formData.append("description", input.description);

  try {
    const response = await fetchWithAuth(GROUPS_URL, {
      method: "POST",
      body: formData,
    });
    return response as Group;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to create group.");
  }
};

export const getGroupById = async (id: number): Promise<Group> => {
  try {
    const response = await fetchWithAuth(GROUP_BY_ID_URL(id), {
      method: "GET",
    });
    return response as Group;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch group.");
  }
};

export const updateGroup = async (id: number, input: CreateGroupInput): Promise<Group> => {
  const formData = new FormData();
  formData.append("group_name", input.group_name);
  if (input.description) formData.append("description", input.description);

  try {
    const response = await fetchWithAuth(GROUP_BY_ID_URL(id), {
      method: "PUT",
      body: formData,
    });
    return response as Group;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to update group.");
  }
};

export const deleteGroup = async (id: number): Promise<MessageResponse> => {
  try {
    const response = await fetchWithAuth(GROUP_BY_ID_URL(id), {
      method: "DELETE",
    });
    return response as MessageResponse;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to delete group.");
  }
};