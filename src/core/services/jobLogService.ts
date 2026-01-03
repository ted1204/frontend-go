import axios from 'axios';

export const getJobLog = async (jobId: number): Promise<string> => {
  const response = await axios.get(`/api/v1/jobs/${jobId}/logs`);
  return response.data?.log || '';
};
