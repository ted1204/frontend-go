import axios from 'axios';

export interface SubmitJobRequest {
  name: string;
  image: string;
  namespace: string;
  priority: string;
}

export const submitJob = async (data: SubmitJobRequest): Promise<void> => {
  await axios.post('/api/k8s/jobs', data);
};
