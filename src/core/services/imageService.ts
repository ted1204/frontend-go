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
}

export interface ImageRequest {
  ID: number;
  UserID: number;
  Name: string;
  Tag: string;
  ProjectID?: number;
  Status: string;
  Note: string;
  CreatedAt: string;
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
  // console.log('getAllowedImages response:', response);

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
    const rawName = img.Name || img.name || '';
    const explicitTag = img.Tag || img.tag || '';

    let normalizedName = rawName;
    let normalizedTag = explicitTag;

    // If backend returned name with tag (e.g., repo:tag), split to avoid duplicate display
    if (rawName.includes(':')) {
      const [base, tagFromName] = rawName.split(':', 2);
      normalizedName = base;
      if (!normalizedTag) normalizedTag = tagFromName;
    }

    return {
      ID: img.ID || img.id || 0,
      Name: normalizedName,
      Tag: normalizedTag,
      ProjectID: img.ProjectID || img.project_id,
      IsGlobal: img.IsGlobal ?? img.is_global ?? false,
      CreatedAt: img.CreatedAt || img.created_at || '',
      IsPulled: img.IsPulled ?? img.is_pulled ?? false,
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

// Get all image requests (admin only)
export const getImageRequests = async (status?: string): Promise<ImageRequest[]> => {
  const url = status
    ? `${API_BASE_URL}/image-requests?status=${status}`
    : `${API_BASE_URL}/image-requests`;
  const response = await fetchWithAuth(url, {
    method: 'GET',
  });
  // Handle both { data: [...] } and direct array responses
  if (Array.isArray(response)) return response;
  if (response?.data && Array.isArray(response.data)) return response.data;
  return [];
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
