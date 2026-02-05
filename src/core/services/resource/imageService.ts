import { API_BASE_URL } from '@/core/config/url';
import { fetchWithAuth } from '@/shared/utils/api';

type ApiResponse<T> = { data?: T } | T;

const extractData = <T>(response: ApiResponse<T>): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as { data?: T }).data as T;
  }
  return response as T;
};

export interface AllowedImage {
  ID: number;
  Name: string;
  Tag: string;
  ProjectID?: number;
  IsGlobal: boolean;
  CreatedAt: string;
  IsPulled: boolean;
  Status?: 'pending' | 'approved' | 'rejected' | string;
}

export interface CreateImageRequestInput {
  name: string;
  tag: string;
  project_id?: number;
}

export interface AddProjectImageInput {
  name: string;
  tag: string;
}

// Get all allowed images (with optional project filter)
export const getAllowedImages = async (projectId?: number): Promise<AllowedImage[]> => {
  try {
    const url = projectId
      ? `${API_BASE_URL}/images/allowed?project_id=${projectId}`
      : `${API_BASE_URL}/images/allowed`;
    const response = await fetchWithAuth(url, {
      method: 'GET',
    });

    const rawData = extractData<RawAllowedImage[]>(response);
    if (!Array.isArray(rawData)) {
      return [];
    }

    // Normalize field names (backend returns lowercase, frontend expects PascalCase)
    return rawData.map((img) => {
      // Prefer a full_name field from the backend when available. Otherwise
      // construct from registry + image name, or fallback to the simple name.
      const fullField = img.FullName || img.full_name || '';
      const imageNameField = img.ImageName || img.image_name || img.Name || img.name || '';
      const explicitTag = img.Tag || img.tag || '';

      let normalizedName = '';
      let normalizedTag = explicitTag || '';

      const stripRegistry = (s: string) => {
        const parts = s.split('/');
        if (parts.length > 1) {
          const first = parts[0];
          if (first.includes('.') || first.includes(':') || first === 'localhost') {
            return parts.slice(1).join('/');
          }
        }
        return s;
      };

      if (fullField) {
        // backend provided the full path (registry/namespace/name); strip registry host
        normalizedName = stripRegistry(fullField);
      } else {
        // prefer the repository path (namespace/name) without showing registry
        normalizedName = imageNameField;
      }

      // If the name accidentally includes a tag (legacy), split it out
      if (!normalizedTag && normalizedName.includes(':')) {
        const lastColon = normalizedName.lastIndexOf(':');
        // ensure colon is not part of a registry host with port (e.g. my.registry:5000)
        const afterColon = normalizedName.slice(lastColon + 1);
        if (!afterColon.includes('/')) {
          normalizedTag = afterColon;
          normalizedName = normalizedName.slice(0, lastColon);
        }
      }

      return {
        ID: img.ID || img.id || 0,
        Name: normalizedName,
        Tag: normalizedTag || 'latest',
        ProjectID: img.ProjectID || img.project_id,
        IsGlobal: img.IsGlobal ?? img.is_global ?? false,
        CreatedAt: img.CreatedAt || img.created_at || '',
        IsPulled: img.IsPulled ?? img.is_pulled ?? false,
      } as AllowedImage;
    });
  } catch (error: unknown) {
    return [];
  }
};

interface RawAllowedImage {
  id?: number;
  ID?: number;
  name?: string;
  Name?: string;
  tag?: string;
  Tag?: string;
  // backend may provide full name or alternate image name fields
  full_name?: string;
  FullName?: string;
  image_name?: string;
  ImageName?: string;
  project_id?: number;
  ProjectID?: number;
  is_global?: boolean;
  IsGlobal?: boolean;
  created_at?: string;
  CreatedAt?: string;
  is_pulled?: boolean;
  IsPulled?: boolean;
}

// Add image directly to a project (for project managers)
export const addProjectImage = async (
  projectId: number,
  input: AddProjectImageInput,
): Promise<AllowedImage> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/projects/${projectId}/images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    return extractData<AllowedImage>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to add project image.');
  }
};

// Remove image from project (for project managers)
export const removeProjectImage = async (projectId: number, imageId: number): Promise<void> => {
  try {
    await fetchWithAuth(`${API_BASE_URL}/projects/${projectId}/images/${imageId}`, {
      method: 'DELETE',
    });
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to remove project image.');
  }
};

// Delete an allowed image (admin only)
export const deleteAllowedImage = async (id: number): Promise<void> => {
  try {
    await fetchWithAuth(`${API_BASE_URL}/images/allowed/${id}`, {
      method: 'DELETE',
    });
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete image.');
  }
};

// Trigger image pull (admin only)
export const pullImage = async (name: string, tag: string): Promise<void> => {
  try {
    await fetchWithAuth(`${API_BASE_URL}/images/pull`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, tag }),
    });
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to pull image.');
  }
};

// Submit a new image request
export const requestImage = async (input: CreateImageRequestInput): Promise<ImageRequest> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/image-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    return extractData<ImageRequest>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to request image.');
  }
};

// Standard frontend interface
export interface ImageRequest {
  ID: number;
  UserID: number;
  Name: string;
  Tag: string;
  ProjectID: number | null;
  Status: string;
  Note: string;
  CreatedAt: string;
}

// Backend response shape (loose typing to handle potential inconsistencies)
interface BackendImageRequest {
  ID?: number;
  id?: number;
  UserID?: number;
  user_id?: number;
  Name?: string;
  name?: string;
  ImageName?: string;
  image_name?: string;
  Tag?: string;
  tag?: string;
  ProjectID?: number;
  project_id?: number;
  Status?: string;
  status?: string;
  Note?: string;
  note?: string;
  CreatedAt?: string;
  created_at?: string;
}

// Helper function to safely parse API response
const parseResponse = (response: unknown): BackendImageRequest[] => {
  const data = extractData<unknown>(response);
  if (Array.isArray(data)) {
    return data as BackendImageRequest[];
  }
  return [];
};

// Helper function to map backend data to frontend interface
const mapToImageRequest = (r: BackendImageRequest, defaultProjectId?: number): ImageRequest => ({
  ID: r.ID ?? r.id ?? 0,
  UserID: r.UserID ?? r.user_id ?? 0,
  Name: r.Name || r.name || r.ImageName || r.image_name || '',
  Tag: r.Tag || r.tag || 'latest',
  ProjectID: r.ProjectID ?? r.project_id ?? defaultProjectId ?? null,
  Status: r.Status || r.status || 'pending',
  Note: r.Note || r.note || '',
  CreatedAt: r.CreatedAt || r.created_at || new Date().toISOString(),
});

// Get all image requests (Admin)
export const getImageRequests = async (status?: string): Promise<ImageRequest[]> => {
  const params = new URLSearchParams();
  if (status) params.append('status', status);

  const url = `${API_BASE_URL}/image-requests?${params.toString()}`;

  try {
    const response = await fetchWithAuth(url, { method: 'GET' });
    const rawData = parseResponse(response);
    return rawData.map((r) => mapToImageRequest(r));
  } catch (error: unknown) {
    return [];
  }
};

// Get image requests for a specific project (Project Member)
export const getProjectImageRequests = async (
  projectId: number,
  status?: string,
): Promise<ImageRequest[]> => {
  const params = new URLSearchParams();
  if (status) params.append('status', status);

  const url = `${API_BASE_URL}/projects/${projectId}/image-requests?${params.toString()}`;

  try {
    const response = await fetchWithAuth(url, { method: 'GET' });
    const rawData = parseResponse(response);
    return rawData.map((r) => mapToImageRequest(r, projectId));
  } catch (error: unknown) {
    return [];
  }
};

// Approve an image request (admin only)
export const approveImageRequest = async (
  id: number,
  note: string,
  isGlobal: boolean = false,
): Promise<void> => {
  try {
    await fetchWithAuth(`${API_BASE_URL}/image-requests/${id}/approve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ note, is_global: isGlobal }),
    });
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to approve image request.');
  }
};

// Reject an image request (admin only)
export const rejectImageRequest = async (id: number, note: string): Promise<void> => {
  try {
    await fetchWithAuth(`${API_BASE_URL}/image-requests/${id}/reject`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ note }),
    });
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to reject image request.');
  }
};
export interface FailedPullJob {
  job_id: string;
  image_name: string;
  image_tag: string;
  status: string;
  progress: number;
  message: string;
  updated_at: string;
}

export interface ActivePullJob {
  job_id: string;
  image_name: string;
  image_tag: string;
  status: string;
  progress: number;
  message: string;
  updated_at: string;
}

// Get failed pull jobs (admin only)
export const getFailedPullJobs = async (limit: number = 10): Promise<FailedPullJob[]> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/images/pull-failed?limit=${limit}`, {
      method: 'GET',
    });
    const data = extractData<FailedPullJob[]>(response);
    return Array.isArray(data) ? data : [];
  } catch (error: unknown) {
    return [];
  }
};

// Get active pull jobs (admin only)
export const getActivePullJobs = async (): Promise<ActivePullJob[]> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/images/pull-active`, {
      method: 'GET',
    });
    const data = extractData<ActivePullJob[]>(response);
    return Array.isArray(data) ? data : [];
  } catch (error: unknown) {
    return [];
  }
};
