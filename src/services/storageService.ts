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

/**
 * Expands the storage capacity for a specific user's hub.
 * Endpoint: PUT /k8s/users/:username/storage/expand
 */
export const expandUserStorage = async (username: string, newSize: string): Promise<void> => {
  try {
    // Updated path to match the new K8s handler structure
    await fetchWithAuth(`${API_BASE_URL}/k8s/users/${username}/storage/expand`, {
      method: 'PUT',
      body: JSON.stringify({ new_size: newSize }),
    });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to expand user storage.');
  }
};

/**
 * Initializes the storage hub for a specific user.
 * Endpoint: POST /k8s/users/:username/storage/init
 */
export const initUserStorage = async (username: string): Promise<void> => {
  try {
    // Ensure this matches the route defined in RegisterK8sRoutes
    await fetchWithAuth(`${API_BASE_URL}/k8s/users/${username}/storage/init`, {
      method: 'POST',
    });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to initialize user storage.');
  }
};

/**
 * Deletes the storage hub for a specific user.
 * Endpoint: DELETE /k8s/users/:username/storage
 */
export const deleteUserStorage = async (username: string): Promise<void> => {
  try {
    await fetchWithAuth(`${API_BASE_URL}/k8s/users/${username}/storage`, {
      method: 'DELETE',
    });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete user storage.');
  }
};

/**
 * Checks if the storage hub exists for a user.
 * Endpoint: GET /k8s/users/:username/storage/status
 */
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

    const data = response.data || response;

    if (!data.nodePort) {
      throw new Error('Server did not return a valid NodePort.');
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
