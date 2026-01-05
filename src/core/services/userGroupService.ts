import { USER_GROUP_URL, USER_GROUP_BY_GROUP_URL, USER_GROUP_BY_USER_URL } from '../config/url';
import { MessageResponse } from '../response/response';
import {
  UserGroup,
  UserGroupUser,
  UserGroupGroup,
} from '../interfaces/userGroup';
import { fetchWithAuth as baseFetchWithAuth } from '@/shared/utils/api';

const fetchWithAuth = async (url: string, options: RequestInit) => {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  // if JSON
  if (options.body && typeof options.body === 'string' && options.body.startsWith('{')) {
    headers['Content-Type'] = 'application/json';
  }

  return baseFetchWithAuth(url, { ...options, headers });
};

export const getUserGroup = async (u_id: number, g_id: number): Promise<UserGroup> => {
  try {
    const response = await fetchWithAuth(`${USER_GROUP_URL}?u_id=${u_id}&g_id=${g_id}`, {
      method: 'GET',
    });
    return response as UserGroup;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch user-group.');
  }
};

export interface UserGroupInputDTO {
  u_id: number;
  g_id: number;
  role: 'admin' | 'manager' | 'user';
}

export const createUserGroup = async (input: UserGroupInputDTO): Promise<UserGroup> => {
  const payload = new URLSearchParams({
    u_id: input.u_id.toString(),
    g_id: input.g_id.toString(),
    role: input.role,
  });
  try {
    const response = await fetchWithAuth(USER_GROUP_URL, {
      method: 'POST',
      body: payload.toString(),
    });
    return response as UserGroup;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create.');
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
      method: 'PUT',
      body: payload.toString(),
    });
    return response as UserGroup;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update user-group.');
  }
};

export interface UserGroupDeleteDTO {
  u_id: number;
  g_id: number;
}

export const deleteUserGroup = async (input: UserGroupDeleteDTO): Promise<MessageResponse> => {
  try {
    const response = await fetchWithAuth(
      `${USER_GROUP_URL}?u_id=${input.u_id}&g_id=${input.g_id}`,
      {
        method: 'DELETE',
      },
    );

    if (response.status === 204) {
      return { message: '204' } as MessageResponse;
    }

    const data = await response.json();
    return data as MessageResponse;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete user-group.');
  }
};

export const getUsersByGroup = async (g_id: number): Promise<UserGroupUser[]> => {
  try {
    const response = await fetchWithAuth(`${USER_GROUP_BY_GROUP_URL}?g_id=${g_id}`, {
      method: 'GET',
    });
    
    // Backend returns map[uint]map[string]interface{} directly
    // Check if it's wrapped in a data property or is the direct map
    const dataMap = response?.data || response;
    
    if (!dataMap || typeof dataMap !== 'object') {
      console.warn('getUsersByGroup: Invalid response format');
      return [];
    }
    
    // The response is a map keyed by group ID
    const groupData = dataMap[g_id.toString()] || dataMap[g_id];
    return groupData?.Users ?? [];
  } catch (error) {
    console.error('Fetch users by group error:', error);
    return [];
  }
};

export const getGroupsByUser = async (u_id: number): Promise<UserGroupGroup[]> => {
  try {
    const response = await fetchWithAuth(`${USER_GROUP_BY_USER_URL}?u_id=${u_id}`, {
      method: 'GET',
    });
    
    // console.log('getGroupsByUser raw response:', response);
    
    // Backend returns an array of UserGroup objects
    // [{ UID: 1, GID: 1, Role: 'admin', ... }]
    
    if (!response || !Array.isArray(response)) {
      console.warn('getGroupsByUser: Expected array response');
      return [];
    }
    
    // Transform UserGroup[] to UserGroupGroup[]
    // We need to fetch group names separately or just return GID and Role
    const groups: UserGroupGroup[] = response.map((ug: UserGroup) => ({
      GID: ug.GID,
      GroupName: '', // Backend doesn't return this in the array format
      Role: ug.Role as 'admin' | 'manager' | 'user',
    }));
    
    // console.log('getGroupsByUser transformed groups:', groups);
    return groups;
  } catch (error) {
    console.error('Fetch groups by user error:', error);
    return [];
  }
};
