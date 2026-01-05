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
  const response = await fetchWithAuth(url, {
    method: 'GET',
  });
  return response.data || [];
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
  return response.data;
};

// Submit a new image request
export const requestImage = async (input: CreateImageRequestInput): Promise<ImageRequest> => {
  const response = await fetchWithAuth(`${API_BASE_URL}/images/request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });
  return response.data;
};

// Get all image requests (admin only)
export const getImageRequests = async (status?: string): Promise<ImageRequest[]> => {
  const url = status
    ? `${API_BASE_URL}/images/requests?status=${status}`
    : `${API_BASE_URL}/images/requests`;
  const response = await fetchWithAuth(url, {
    method: 'GET',
  });
  return response.data || [];
};

// Approve an image request (admin only)
export const approveImageRequest = async (id: number, note: string): Promise<void> => {
  await fetchWithAuth(`${API_BASE_URL}/images/requests/${id}/approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'approved', note }),
  });
};

// Reject an image request (admin only)
export const rejectImageRequest = async (id: number, note: string): Promise<void> => {
  await fetchWithAuth(`${API_BASE_URL}/images/requests/${id}/reject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'rejected', note }),
  });
};
