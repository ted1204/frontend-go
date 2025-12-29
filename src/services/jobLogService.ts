import axios from 'axios';

export const getJobLog = async (jobId: number): Promise<string> => {
  const response = await axios.get(`/api/k8s/jobs/${jobId}/log`);
  return response.data?.log || '';
};
