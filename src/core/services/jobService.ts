import { JOBS_URL, JOB_BY_ID_URL, JOB_LOGS_URL } from '../config/url';
import { fetchWithAuth } from '@/shared/utils/api';

type SuccessResponse<T> = { code?: number; message?: string; data?: T };

const unwrap = <T>(response: unknown): T => {
  const maybe = response as SuccessResponse<T> | T;
  if (maybe && typeof maybe === 'object' && 'data' in maybe) {
    return (maybe as SuccessResponse<T>).data as T;
  }
  return maybe as T;
};

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
  const response = await fetchWithAuth(JOBS_URL);
  const data = unwrap<Job[]>(response);
  return Array.isArray(data) ? data : [];
};

export const getJob = async (id: number): Promise<Job> => {
  const response = await fetchWithAuth(JOB_BY_ID_URL(id));
  return unwrap<Job>(response);
};

export const getJobLogs = async (id: number): Promise<string[]> => {
  const response = await fetchWithAuth(JOB_LOGS_URL(id));
  const data = unwrap<JobLog[]>(response);
  if (Array.isArray(data)) {
    return data
      .map((log) => log.Content ?? (log as unknown as { content?: string }).content ?? '')
      .filter(Boolean);
  }
  return [];
};

export interface JobLog {
  ID: number;
  JobID: number;
  Content: string;
}
