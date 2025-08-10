import { USER_GROUP_URL, USER_GROUP_BY_GROUP_URL, USER_GROUP_BY_USER_URL } from "../config/url";

export interface UserGroup {
  uid: number;
  gid: number;
  role: string; // ENUM: admin, manager, user
  createdAt: string;
  updatedAt: string;
}

export interface ErrorResponse {
  error: string;
}

export interface MessageResponse {
  message: string;
}

export interface SuccessResponse {
  code: number;
  data: UserGroup | UserGroup[];
  message: string;
}

const fetchWithAuth = async (url: string, options: RequestInit) => {
  const token = localStorage.getItem("token"); // 假設 token 存儲在 localStorage
  const headers = {
    ...options.headers,
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: token ? `Bearer ${token}` : "",
  };
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }
  return response.json();
};

export const getUserGroup = async (u_id: number, g_id: number): Promise<UserGroup> => {
  try {
    const response = await fetchWithAuth(`${USER_GROUP_URL}?u_id=${u_id}&g_id=${g_id}`, {
      method: "GET",
    });
    return (response as SuccessResponse).data as UserGroup;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch user-group.");
  }
};

export interface CreateUserGroupInput {
  u_id: number;
  g_id: number;
  role: "admin" | "manager" | "user";
}

export const createUserGroup = async (input: CreateUserGroupInput): Promise<UserGroup> => {
  const formData = new URLSearchParams();
  formData.append("u_id", input.u_id.toString());
  formData.append("g_id", input.g_id.toString());
  formData.append("role", input.role);

  try {
    const response = await fetchWithAuth(USER_GROUP_URL, {
      method: "POST",
      body: formData,
    });
    return (response as SuccessResponse).data as UserGroup;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to create user-group.");
  }
};

export const updateUserGroup = async (u_id: number, g_id: number, role: "admin" | "manager" | "user"): Promise<UserGroup> => {
  const formData = new URLSearchParams();
  formData.append("u_id", u_id.toString());
  formData.append("g_id", g_id.toString());
  formData.append("role", role);

  try {
    const response = await fetchWithAuth(USER_GROUP_URL, {
      method: "PUT",
      body: formData,
    });
    return (response as SuccessResponse).data as UserGroup;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to update user-group.");
  }
};

export const deleteUserGroup = async (u_id: number, g_id: number): Promise<MessageResponse> => {
  const formData = new URLSearchParams();
  formData.append("u_id", u_id.toString());
  formData.append("g_id", g_id.toString());

  try {
    const response = await fetchWithAuth(USER_GROUP_URL, {
      method: "DELETE",
      body: formData,
    });
    return response as MessageResponse;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to delete user-group.");
  }
};

export const getUsersByGroup = async (g_id: number): Promise<UserGroup[]> => {
  try {
    const response = await fetchWithAuth(`${USER_GROUP_BY_GROUP_URL}?g_id=${g_id}`, {
      method: "GET",
    });
    return (response as SuccessResponse).data as UserGroup[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch users by group.");
  }
};

export const getGroupsByUser = async (u_id: number): Promise<UserGroup[]> => {
  try {
    const response = await fetchWithAuth(`${USER_GROUP_BY_USER_URL}?u_id=${u_id}`, {
      method: "GET",
    });
    return (response as SuccessResponse).data as UserGroup[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch groups by user.");
  }
};