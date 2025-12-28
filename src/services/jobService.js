import axios from 'axios';
const API_URL = '/api/k8s/jobs';
export const getJobs = async () => {
    const response = await axios.get(API_URL);
    return Array.isArray(response.data) ? response.data : [];
};
export const getJob = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};
