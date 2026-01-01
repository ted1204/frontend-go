import { API_BASE_URL } from '../config/url';
import { Form, CreateFormRequest } from '../interfaces/form';
import { fetchWithAuth as baseFetchWithAuth } from '@/shared/utils/api';

const fetchWithAuth = async (url: string, options: RequestInit) => {
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
  };
  return baseFetchWithAuth(url, { ...options, headers });
};

export const createForm = async (data: CreateFormRequest): Promise<Form> => {
  const response = await fetchWithAuth(`${API_BASE_URL}/forms`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.data;
};

export const getMyForms = async (): Promise<Form[]> => {
  const response = await fetchWithAuth(`${API_BASE_URL}/forms/my`, {
    method: 'GET',
  });
  return response.data;
};

export const getAllForms = async (): Promise<Form[]> => {
  const response = await fetchWithAuth(`${API_BASE_URL}/forms`, {
    method: 'GET',
  });
  return response.data;
};

export const updateFormStatus = async (id: number, status: string): Promise<Form> => {
  const response = await fetchWithAuth(`${API_BASE_URL}/forms/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
  return response.data;
};
