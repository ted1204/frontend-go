import { INSTANCE_BY_ID_URL } from '../config/url';
import { MessageResponse } from '../response/response'; // Adjust the import path as necessary
import { fetchWithAuth } from '@/shared/utils/api';

export const instantiate = async (id: number): Promise<MessageResponse> => {
  try {
    const response = await fetchWithAuth(INSTANCE_BY_ID_URL(id), {
      method: 'POST',
    });
    return response as MessageResponse;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to instantiate.');
  }
};

export const destruct = async (id: number): Promise<void> => {
  try {
    await fetchWithAuth(INSTANCE_BY_ID_URL(id), {
      method: 'DELETE',
    });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to destruct.');
  }
};
