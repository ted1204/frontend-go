import { API_BASE_URL } from '../config/url';
import { fetchWithAuth } from '@/shared/utils/api';

export interface AllowedImage {
  ID: number;
  Name: string;
  Tag: string;
  ProjectID?: number;
  IsGlobal: boolean;
  CreatedAt: string;
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
  let rawData: any[] = [];
  if (Array.isArray(response)) {
    rawData = response;
  } else if (response?.data && Array.isArray(response.data)) {
    rawData = response.data;
  } else {
    console.warn('getAllowedImages: Unexpected response format', response);
    return [];
  }
  
  // Normalize field names (backend returns lowercase, frontend expects PascalCase)
  return rawData.map((img: any) => ({
    ID: img.ID || img.id,
    Name: img.Name || img.name,
    Tag: img.Tag || img.tag,
    ProjectID: img.ProjectID || img.project_id,
    IsGlobal: img.IsGlobal ?? img.is_global ?? false,
    CreatedAt: img.CreatedAt || img.created_at || img.CreatedAt,
  }));
};

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
