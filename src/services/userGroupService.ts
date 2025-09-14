import { USER_GROUP_URL, USER_GROUP_BY_GROUP_URL, USER_GROUP_BY_USER_URL } from "../config/url";
import { ErrorResponse, MessageResponse } from "../response/response";
import { GetGroupsByUserResponse, GetUsersByGroupResponse, UserGroup, UserGroupUser, UserGroupGroup } from "../interfaces/userGroup";


const fetchWithAuth = async (url: string, options: RequestInit) => {
  const headers = {
    ...options.headers,
    "Content-Type": "application/x-www-form-urlencoded",
  };
  // if JSON
  if (options.body && typeof options.body === "string" && options.body.startsWith("{")) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, { ...options, headers, credentials: 'include' });
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    console.error("Error data:", errorData);
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }
  if (response.status === 204) {
    return response
  }
  return response.json();
};

export const getUserGroup = async (u_id: number, g_id: number): Promise<UserGroup> => {
  try {
    const response = await fetchWithAuth(`${USER_GROUP_URL}?u_id=${u_id}&g_id=${g_id}`, {
      method: "GET",
    });
    return response as UserGroup;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch user-group.");
  }
};

export interface UserGroupInputDTO {
  u_id: number;
  g_id: number;
  role: "admin" | "manager" | "user";
}

export const createUserGroup = async (input: UserGroupInputDTO): Promise<UserGroup> => {
  const payload = new URLSearchParams({
    u_id: input.u_id.toString(),
    g_id: input.g_id.toString(),
    role: input.role,
  });
  try {
    const response = await fetchWithAuth(USER_GROUP_URL, {
      method: "POST",
      body: payload.toString(),
    });
    return response as UserGroup;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to create.");
  }
};

export const updateUserGroup = async (input: UserGroupInputDTO): Promise<UserGroup> => {
  const payload = new URLSearchParams({
    u_id: input.u_id.toString(),
    g_id: input.g_id.toString(),
    role: input.role,
  });
  try {
    const response = await fetchWithAuth(USER_GROUP_URL, {
      method: "PUT",
      body: payload.toString(),
    });
    return response as UserGroup;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to update user-group.");
  }
};

export interface UserGroupDeleteDTO {
  u_id: number;
  g_id: number;
}

export const deleteUserGroup = async (input: UserGroupDeleteDTO): Promise<MessageResponse> => {
  try {
    const response = await fetchWithAuth(`${USER_GROUP_URL}?u_id=${input.u_id}&g_id=${input.g_id}`, {
      method: "DELETE",
    });

    if (response.status === 204) {
      return { message: "204" } as MessageResponse;
    }

    const data = await response.json();
    return data as MessageResponse;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to delete user-group.");
  }
};

export const getUsersByGroup = async (g_id: number): Promise<UserGroupUser[]> => {
  try {
    const response = await fetchWithAuth(`${USER_GROUP_BY_GROUP_URL}?g_id=${g_id}`, {
      method: "GET",
    });
    const successResponse = response as GetUsersByGroupResponse;
    const groupData = successResponse.data[g_id.toString()];
    return groupData?.Users ?? [];
  } catch (error) {
    console.error("Fetch users by group error:", error);
    return [];
  }
};

export const getGroupsByUser = async (u_id: number): Promise<UserGroupGroup[]> => {
  try {
    const response = await fetchWithAuth(`${USER_GROUP_BY_USER_URL}?u_id=${u_id}`, {
      method: "GET",
    });
    const successResponse = response as GetGroupsByUserResponse;
    const userData = successResponse.data[u_id.toString()];
    return userData.Groups || []
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch groups by user.");
  }
};