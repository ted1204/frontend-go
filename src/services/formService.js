import { API_BASE_URL } from '../config/url';
import { fetchWithAuth as baseFetchWithAuth } from '../utils/api';
const fetchWithAuth = async (url, options) => {
    const headers = {
        ...options.headers,
        'Content-Type': 'application/json',
    };
    return baseFetchWithAuth(url, { ...options, headers });
};
export const createForm = async (data) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/forms`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return response.data;
};
export const getMyForms = async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/forms/my`, {
        method: 'GET',
    });
    return response.data;
};
export const getAllForms = async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/forms`, {
        method: 'GET',
    });
    return response.data;
};
export const updateFormStatus = async (id, status) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/forms/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
    });
    return response.data;
};
