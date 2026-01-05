import { API_BASE_URL } from '../config/url';
import { Form, CreateFormRequest, FormMessage, CreateFormMessageRequest } from '../interfaces/form';
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
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return response.data;
};

// Message-related functions
export const createFormMessage = async (
  formId: number,
  data: CreateFormMessageRequest,
): Promise<FormMessage> => {
  const response = await fetchWithAuth(`${API_BASE_URL}/forms/${formId}/messages`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.data;
};

export const getFormMessages = async (formId: number): Promise<FormMessage[]> => {
  const response = await fetchWithAuth(`${API_BASE_URL}/forms/${formId}/messages`, {
    method: 'GET',
  });
  return response.data;
};
