import {
  PVC_CREATE_URL,
  PVC_EXPAND_URL,
  PVC_LIST_URL,
  PVC_GET_URL,
  PVC_DELETE_URL,
  PVC_FILEBROWSER_START_URL,
  PVC_FILEBROWSER_STOP_URL,
  USER_DRIVE_URL,
  API_BASE_URL,
} from '@/core/config/url';
import { PVC, PVCRequest } from '@/core/interfaces/pvc';

import {
  ProjectPVC,
  CreateProjectStoragePayload,
  CreateStorageResponse,
} from '@/core/interfaces/projectStorage';
import { fetchWithAuth } from '@/shared/utils/api';

type ApiResponse<T> = { data?: T } | T;

const extractData = <T>(response: ApiResponse<T>): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as { data?: T }).data as T;
  }
  return response as T;
};

// --- Legacy PVC Operations ---

export const createPVC = async (input: PVCRequest): Promise<{ [key: string]: string }> => {
  const formData = new URLSearchParams();
  formData.append('name', input.name);
  formData.append('namespace', input.namespace);
  formData.append('size', input.size);
  formData.append('storageClassName', input.storageClassName);

  try {
    const response = await fetchWithAuth(PVC_CREATE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });
    return extractData<{ [key: string]: string }>(response);
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
    const response = await fetchWithAuth(PVC_EXPAND_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });
    return extractData<{ [key: string]: string }>(response);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to expand PVC.');
  }
};

export const getPVCList = async (namespace: string): Promise<PVC[]> => {
  try {
    const response = await fetchWithAuth(PVC_LIST_URL(namespace), {
      method: 'GET',
    });
    return extractData<PVC[]>(response);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch PVC list.');
  }
};

export const getPVCListByProject = async (pid: number): Promise<PVC[]> => {
  try {
    // New backend exposes project storages via /k8s/storage/projects/my-storages (user-scoped)
    // and /k8s/storage/projects (admin). The per-project endpoint was removed.
    // We'll fetch the user's accessible project storages and filter by project id.
    const allMy = await getMyProjectStorages();
    const filtered = (allMy || []).filter(
      (s) => String(s.id) === String(pid) || String(s.id) === String(pid),
    );

    // Map ProjectPVC -> PVC shape expected by callers
    const mapped: PVC[] = filtered.map((p) => ({
      name: p.pvcName || '',
      namespace: p.namespace || '',
      size: p.capacity || '',
      status: p.status || '',
    }));

    return mapped;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch PVC list.');
  }
};

export const getPVC = async (namespace: string, name: string): Promise<PVC> => {
  try {
    const response = await fetchWithAuth(PVC_GET_URL(namespace, name), {
      method: 'GET',
    });
    return extractData<PVC>(response);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch PVC.');
  }
};

export const deletePVC = async (
  namespace: string,
  name: string,
): Promise<{ [key: string]: string }> => {
  try {
    const response = await fetchWithAuth(PVC_DELETE_URL(namespace, name), {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return extractData<{ [key: string]: string }>(response);
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ namespace, pvc_name: pvcName }),
    });
    return extractData<{ nodePort: number }>(response);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to start file browser.');
  }
};

export const stopFileBrowser = async (namespace: string, pvcName: string): Promise<void> => {
  try {
    await fetchWithAuth(PVC_FILEBROWSER_STOP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
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

export const deleteProjectStorage = async (pid: string): Promise<void> => {
  try {
    await fetchWithAuth(`${API_BASE_URL}/k8s/storage/projects/${pid}`, {
      method: 'DELETE',
    });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete project storage.');
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
    const data = extractData<{ nodePort?: number }>(response);

    if (!data.nodePort) {
      // In Ingress mode, nodePort might not be returned/needed
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

    if (!response) {
      console.warn('getProjectStorages: Received null/undefined response from API.');
      return [];
    }

    const result = extractData<unknown>(response);
    const list = Array.isArray(result) ? (result as Record<string, unknown>[]) : [];

    // Normalize fields to ProjectPVC shape
    return list.map((item) => {
      const capacityRaw = item.capacity ?? item.Capacity ?? '';
      const capacity = typeof capacityRaw === 'number' ? `${capacityRaw}Gi` : capacityRaw;
      return {
        id: String(item.id ?? item.ID ?? item.project_id ?? item.projectId ?? ''),
        pvcName: item.pvcName ?? item.pvc_name ?? item.name ?? '',
        projectName: item.projectName ?? item.project_name ?? '',
        namespace: item.namespace ?? '',
        capacity,
        status: item.status ?? '',
        accessMode: item.accessMode ?? item.access_mode ?? '',
        createdAt: item.createdAt ?? item.created_at ?? '',
        role: item.role ?? item.Role ?? '',
      } as ProjectPVC;
    });
  } catch (error) {
    console.error('getProjectStorages error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch project storages.');
  }
};

/**
 * Provision a new storage for a project.
 * POST /k8s/storage/projects
 */
export const createProjectStorage = async (
  payload: CreateProjectStoragePayload,
): Promise<CreateStorageResponse> => {
  try {
    // Convert camelCase to snake_case for backend compatibility
    const backendPayload = {
      project_id: payload.projectId,
      project_name: payload.projectName,
      name: payload.name,
      capacity: payload.capacity,
    };
    const response = await fetchWithAuth(PROJECT_STORAGE_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backendPayload),
    });
    return extractData<CreateStorageResponse>(response);
  } catch (error: unknown) {
    const err = error as {
      response?: { status?: number; data?: { error?: string } };
      message?: string;
    };

    if (err.response?.status === 409) {
      throw new Error('Project storage already exists (duplicate name).');
    }

    const msg = err.response?.data?.error || err.message || 'Failed to create project storage.';
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

export const getUserHubProxyUrl = (): string => {
  return `${API_BASE_URL}/k8s/users/proxy/`;
};

/**
 * Fetch project storages for the current logged-in user.
 * GET /k8s/storage/projects/my-storages
 */
export const getMyProjectStorages = async (): Promise<ProjectPVC[]> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/k8s/storage/projects/my-storages`, {
      method: 'GET',
    });

    const result = extractData<unknown>(response);
    const rawList = Array.isArray(result) ? (result as Record<string, unknown>[]) : [];

    // Normalize backend fields to frontend interface
    const pvcs: ProjectPVC[] = rawList.map((item) => {
      const capacityRaw = item.capacity ?? item.Capacity ?? '';
      const capacity = typeof capacityRaw === 'number' ? `${capacityRaw}Gi` : String(capacityRaw);
      const statusValue = String(item.status ?? '');
      const status = (
        ['Bound', 'Pending', 'Lost', 'Terminating'].includes(statusValue) ? statusValue : 'Pending'
      ) as 'Bound' | 'Pending' | 'Lost' | 'Terminating';
      return {
        id: String(item.id ?? item.ID ?? item.project_id ?? item.projectId ?? ''),
        pvcName: String(item.pvcName ?? item.pvc_name ?? item.name ?? ''),
        projectName: String(item.projectName ?? item.project_name ?? ''),
        namespace: String(item.namespace ?? ''),
        capacity,
        status,
        accessMode: String(item.accessMode ?? item.access_mode ?? ''),
        createdAt: String(item.createdAt ?? item.created_at ?? ''),
        role: String(item.role ?? item.Role ?? ''),
      };
    });

    return pvcs;
  } catch (error) {
    console.error('getMyProjectStorages error:', error);
    throw new Error('Failed to fetch your project storages.');
  }
};

// storageService.ts

/**
 * Start project file browser with RBAC consideration on backend.
 * POST /k8s/storage/projects/:id/start
 */
export const startProjectFileBrowser = async (projectId: string | number): Promise<void> => {
  await fetchWithAuth(`${API_BASE_URL}/k8s/storage/projects/${projectId}/start`, {
    method: 'POST',
  });
};

/**
 * Stop project file browser for a specific project.
 * DELETE /k8s/storage/projects/:id/stop
 */
export const stopProjectFileBrowser = async (projectId: string | number): Promise<void> => {
  await fetchWithAuth(`${API_BASE_URL}/k8s/storage/projects/${projectId}/stop`, {
    method: 'DELETE',
  });
};
