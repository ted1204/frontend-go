import { API_BASE_URL } from '../config/url';
import { fetchWithAuth } from '@/shared/utils/api';

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
  const url = projectId
    ? `${API_BASE_URL}/images/allowed?project_id=${projectId}`
    : `${API_BASE_URL}/images/allowed`;
  // console.log('Fetching allowed images from:', url);
  const response = await fetchWithAuth(url, {
    method: 'GET',
  });
  console.log('getAllowedImages response:', response);

  // Handle both { data: [...] } and direct array responses
  let rawData: RawAllowedImage[] = [];
  if (Array.isArray(response)) {
    rawData = response as RawAllowedImage[];
  } else if (
    response &&
    typeof response === 'object' &&
    'data' in response &&
    Array.isArray((response as { data: unknown[] }).data)
  ) {
    rawData = (response as { data: RawAllowedImage[] }).data;
  } else {
    console.warn('getAllowedImages: Unexpected response format', response);
    return [];
  }

  // Normalize field names (backend returns lowercase, frontend expects PascalCase)
  return rawData.map((img) => {
    // Prefer a full_name field from the backend when available. Otherwise
    // construct from registry + image name, or fallback to the simple name.
    const fullField = (img as any).FullName || (img as any).full_name || '';
    const registryField = (img as any).Registry || (img as any).registry || '';
    const imageNameField = (img as any).ImageName || (img as any).image_name || img.Name || img.name || '';
    const explicitTag = (img as any).Tag || (img as any).tag || '';

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
      IsGlobal: img.IsGlobal ?? (img as any).is_global ?? false,
      CreatedAt: img.CreatedAt || img.created_at || '',
      IsPulled: img.IsPulled ?? (img as any).is_pulled ?? false,
    } as AllowedImage;
  });
};

interface RawAllowedImage {
  id?: number;
  ID?: number;
  name?: string;
  Name?: string;
  tag?: string;
  Tag?: string;
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
  const response = await fetchWithAuth(`${API_BASE_URL}/projects/${projectId}/images`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });
  // Handle both { data: {...} } and direct object responses
  if (response?.data) return response.data;
  return response;
};

// Remove image from project (for project managers)
export const removeProjectImage = async (projectId: number, imageId: number): Promise<void> => {
  await fetchWithAuth(`${API_BASE_URL}/projects/${projectId}/images/${imageId}`, {
    method: 'DELETE',
  });
};

// Delete an allowed image (admin only)
export const deleteAllowedImage = async (id: number): Promise<void> => {
  await fetchWithAuth(`${API_BASE_URL}/images/allowed/${id}`, {
    method: 'DELETE',
  });
};

// Trigger image pull (admin only)
export const pullImage = async (name: string, tag: string): Promise<void> => {
  await fetchWithAuth(`${API_BASE_URL}/images/pull`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, tag }),
  });
};

// Submit a new image request
export const requestImage = async (input: CreateImageRequestInput): Promise<ImageRequest> => {
  const response = await fetchWithAuth(`${API_BASE_URL}/image-requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });
  if (response?.data) return response.data;
  return response;
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
  ID?: number;       id?: number;
  UserID?: number;   user_id?: number;
  Name?: string;     name?: string;     ImageName?: string; image_name?: string;
  Tag?: string;      tag?: string;
  ProjectID?: number; project_id?: number;
  Status?: string;   status?: string;
  Note?: string;     note?: string;
  CreatedAt?: string; created_at?: string;
}

// Helper function to safely parse API response
const parseResponse = (response: any): BackendImageRequest[] => {
  if (Array.isArray(response)) {
    return response;
  }
  if (response?.data && Array.isArray(response.data)) {
    return response.data;
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
  } catch (error) {
    console.error('Failed to fetch all image requests:', error);
    return [];
  }
};

// Get image requests for a specific project (Project Member)
export const getProjectImageRequests = async (projectId: number, status?: string): Promise<ImageRequest[]> => {
  const params = new URLSearchParams();
  if (status) params.append('status', status);

  const url = `${API_BASE_URL}/projects/${projectId}/image-requests?${params.toString()}`;

  try {
    const response = await fetchWithAuth(url, { method: 'GET' });
    const rawData = parseResponse(response);
    return rawData.map((r) => mapToImageRequest(r, projectId));
  } catch (error) {
    console.error(`Failed to fetch requests for project ${projectId}:`, error);
    return [];
  }
};

// Approve an image request (admin only)
export const approveImageRequest = async (
  id: number,
  note: string,
  isGlobal: boolean = false,
): Promise<void> => {
  await fetchWithAuth(`${API_BASE_URL}/image-requests/${id}/approve`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ note, is_global: isGlobal }),
  });
};

// Reject an image request (admin only)
export const rejectImageRequest = async (id: number, note: string): Promise<void> => {
  await fetchWithAuth(`${API_BASE_URL}/image-requests/${id}/reject`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ note }),
  });
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
  const response = await fetchWithAuth(`${API_BASE_URL}/images/pull-failed?limit=${limit}`, {
    method: 'GET',
  });

  // Handle both { data: [...] } and direct array responses
  if (Array.isArray(response)) {
    return response as FailedPullJob[];
  }
  if (response?.data && Array.isArray(response.data)) {
    return response.data as FailedPullJob[];
  }
  return [];
};

// Get active pull jobs (admin only)
export const getActivePullJobs = async (): Promise<ActivePullJob[]> => {
  const response = await fetchWithAuth(`${API_BASE_URL}/images/pull-active`, {
    method: 'GET',
  });

  // Handle both { data: [...] } and direct array responses
  if (Array.isArray(response)) {
    return response as ActivePullJob[];
  }
  if (response?.data && Array.isArray(response.data)) {
    return response.data as ActivePullJob[];
  }
  return [];
};
