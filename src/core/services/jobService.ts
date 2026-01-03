import axios from 'axios';

const API_URL = '/api/v1/jobs';

export interface Job {
  ID: number;
  UserID: number;
  Name: string;
  Namespace: string;
  Image: string;
  Status: string;
  Priority: string;
  K8sJobName: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export const getJobs = async (): Promise<Job[]> => {
  const response = await axios.get(API_URL);
  return Array.isArray(response.data) ? response.data : [];
};

export const getJob = async (id: number): Promise<Job> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};
