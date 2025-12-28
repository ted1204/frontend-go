import { INSTANCE_BY_ID_URL } from '../config/url';
import { fetchWithAuth } from '../utils/api';
export const instantiate = async (id) => {
    try {
        const response = await fetchWithAuth(INSTANCE_BY_ID_URL(id), {
            method: 'POST',
        });
        return response;
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to instantiate.');
    }
};
export const destruct = async (id) => {
    try {
        await fetchWithAuth(INSTANCE_BY_ID_URL(id), {
            method: 'DELETE',
        });
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to destruct.');
    }
};
