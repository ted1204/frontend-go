import {
  PVC_CREATE_URL,
  PVC_EXPAND_URL,
  PVC_LIST_URL,
  PVC_LIST_BY_PROJECT_URL,
  PVC_GET_URL,
  PVC_DELETE_URL,
  PVC_FILEBROWSER_START_URL,
  PVC_FILEBROWSER_STOP_URL,
  USER_DRIVE_URL,
  API_BASE_URL,
} from '../config/url';
import { PVC, PVCRequest } from '../interfaces/pvc';
// 請確保此路徑正確，或將介面定義直接寫在下方
import { ProjectPVC, CreateProjectStoragePayload, CreateStorageResponse } from '../interfaces/projectStorage';
import { fetchWithAuth as baseFetchWithAuth } from '../utils/api';

const fetchWithAuth = async (url: string, options: RequestInit) => {
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
  };
  return baseFetchWithAuth(url, { ...options, headers });
};

const fetchWithAuthForm = async (url: string, options: RequestInit) => {
  const headers = {
    ...options.headers,
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  return baseFetchWithAuth(url, { ...options, headers });
};

// --- Legacy PVC Operations ---

export const createPVC = async (input: PVCRequest): Promise<{ [key: string]: string }> => {
  const formData = new URLSearchParams();
  formData.append('name', input.name);
  formData.append('namespace', input.namespace);
  formData.append('size', input.size);
  formData.append('storageClassName', input.storageClassName);

  try {
    const response = await fetchWithAuthForm(PVC_CREATE_URL, {
      method: 'POST',
      body: formData,
    });
    return response as { [key: string]: string };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create PVC.');
  }
};

export const expandPVC = async (input: PVCRequest): Promise<{ [key: string]: string }> => {
  const formData = new URLSearchParams();
  formData.append('name', input.name);
  formData.append('namespace', input.namespace);
  formData.append('size', input.size);
  formData.append('storageClassName', input.storageClassName);

  try {
    const response = await fetchWithAuthForm(PVC_EXPAND_URL, {
      method: 'PUT',
      body: formData,
    });
    return response as { [key: string]: string };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to expand PVC.');
  }
};

export const getPVCList = async (namespace: string): Promise<PVC[]> => {
  try {
    const response = await fetchWithAuth(PVC_LIST_URL(namespace), {
      method: 'GET',
    });
    return response.data as PVC[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch PVC list.');
  }
};

export const getPVCListByProject = async (pid: number): Promise<PVC[]> => {
  try {
    const response = await fetchWithAuth(PVC_LIST_BY_PROJECT_URL(pid), {
      method: 'GET',
    });
    return response.data as PVC[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch PVC list.');
  }
};

export const getPVC = async (namespace: string, name: string): Promise<PVC> => {
  try {
    const response = await fetchWithAuth(PVC_GET_URL(namespace, name), {
      method: 'GET',
    });
    return response.data as PVC;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch PVC.');
  }
};

export const deletePVC = async (
  namespace: string,
  name: string,
): Promise<{ [key: string]: string }> => {
  try {
    const response = await fetchWithAuthForm(PVC_DELETE_URL(namespace, name), {
      method: 'DELETE',
    });
    return response as { [key: string]: string };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete PVC.');
  }
};

export const startFileBrowser = async (
  namespace: string,
  pvcName: string,
): Promise<{ nodePort: number }> => {
  try {
    const response = await fetchWithAuth(PVC_FILEBROWSER_START_URL, {
      method: 'POST',
      body: JSON.stringify({ namespace, pvc_name: pvcName }),
    });
    return response.data as { nodePort: number };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to start file browser.');
  }
};

export const stopFileBrowser = async (namespace: string, pvcName: string): Promise<void> => {
  try {
    await fetchWithAuth(PVC_FILEBROWSER_STOP_URL, {
      method: 'POST',
      body: JSON.stringify({ namespace, pvc_name: pvcName }),
    });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to stop file browser.');
  }
};

// --- User Storage Hub Operations ---

export const expandUserStorage = async (username: string, newSize: string): Promise<void> => {
  try {
    await fetchWithAuth(`${API_BASE_URL}/k8s/users/${username}/storage/expand`, {
      method: 'PUT',
      body: JSON.stringify({ new_size: newSize }),
    });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to expand user storage.');
  }
};

export const initUserStorage = async (username: string): Promise<void> => {
  try {
    await fetchWithAuth(`${API_BASE_URL}/k8s/users/${username}/storage/init`, {
      method: 'POST',
    });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to initialize user storage.');
  }
};

export const deleteUserStorage = async (username: string): Promise<void> => {
  try {
    await fetchWithAuth(`${API_BASE_URL}/k8s/users/${username}/storage`, {
      method: 'DELETE',
    });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete user storage.');
  }
};

export const checkUserStorageStatus = async (username: string): Promise<boolean> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/k8s/users/${username}/storage/status`, {
      method: 'GET',
    });
    return response.exists;
  } catch (error) {
    console.error('Failed to check status', error);
    return false;
  }
};

export const openUserDrive = async (): Promise<{ nodePort: number }> => {
  try {
    const response = await fetchWithAuth(USER_DRIVE_URL, {
      method: 'POST',
    });
    // Compatible with both direct object and nested data response
    const data = response.data || response;

    if (!data.nodePort) {
      // In Ingress mode, nodePort might not be returned/needed, but we keep validation if legacy depends on it
      // If moving fully to Ingress, you might want to relax this check.
      // throw new Error('Server did not return a valid NodePort.');
    }

    return { nodePort: Number(data.nodePort) };
  } catch (error) {
    console.error('Failed to open drive:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to open user drive.');
  }
};

export const stopUserDrive = async (): Promise<void> => {
  try {
    await fetchWithAuth(USER_DRIVE_URL, {
      method: 'DELETE',
    });
  } catch (error) {
    console.warn('Failed to stop user drive:', error);
  }
};

// --- [NEW] Project Storage Operations ---

const PROJECT_STORAGE_BASE_URL = `${API_BASE_URL}/k8s/storage/projects`;

/**
 * Fetch all project storages (PVCs) via Admin API.
 * GET /k8s/storage/projects
 */
export const getProjectStorages = async (): Promise<ProjectPVC[]> => {
  try {
    const response = await fetchWithAuth(PROJECT_STORAGE_BASE_URL, {
      method: 'GET',
    });

    // 1. Safety check: Handle null or undefined response from fetchWithAuth
    if (!response) {
      console.warn('getProjectStorages: Received null/undefined response from API.');
      return [];
    }

    // 2. Extract data: Check if the backend wraps the array in a "data" property
    // Matches common API patterns: { data: [...] } or just [...]
    const result = response.data !== undefined ? response.data : response;

    // 3. Type guard: Ensure the final result is always an array to prevent .map() crashes in UI
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error('getProjectStorages error:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch project storages.'
    );
  }
};

/**
 * Provision a new storage for a project.
 * POST /k8s/storage/projects
 */
export const createProjectStorage = async (payload: CreateProjectStoragePayload): Promise<CreateStorageResponse> => {
  try {
    const response = await fetchWithAuth(PROJECT_STORAGE_BASE_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return (response.data || response) as CreateStorageResponse;
  } catch (error: any) {
    const msg = error.response?.data?.error || error.message || 'Failed to create project storage.';
    throw new Error(msg);
  }
};

/**
 * Helper to get the Proxy URL for opening the project file browser.
 * Note: This URL requires the user to be a member of the project.
 */
export const getProjectStorageProxyUrl = (projectId: number | string): string => {
  return `${PROJECT_STORAGE_BASE_URL}/${projectId}/proxy/`;
};