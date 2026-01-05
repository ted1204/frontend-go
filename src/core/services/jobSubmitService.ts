import { JOBS_URL } from '../config/url';
import { fetchWithAuth } from '@/shared/utils/api';

export interface SubmitJobRequest {
  name: string;
  image: string;
  namespace: string;
  priority: string;
}

export const submitJob = async (data: SubmitJobRequest): Promise<void> => {
  await fetchWithAuth(JOBS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};
