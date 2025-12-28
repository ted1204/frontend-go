import { GROUPS_URL, GROUP_BY_ID_URL } from '../config/url';
import { fetchWithAuth } from '../utils/api';
export const getGroups = async () => {
    try {
        const response = await fetchWithAuth(GROUPS_URL, {
            method: 'GET',
        });
        return response;
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch groups.');
    }
};
export const createGroup = async (input) => {
    const formData = new FormData();
    formData.append('group_name', input.group_name);
    if (input.description)
        formData.append('description', input.description);
    try {
        const response = await fetchWithAuth(GROUPS_URL, {
            method: 'POST',
            body: formData,
        });
        return response;
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to create group.');
    }
};
export const getGroupById = async (id) => {
    try {
        const response = await fetchWithAuth(GROUP_BY_ID_URL(id), {
            method: 'GET',
        });
        return response;
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch group.');
    }
};
export const updateGroup = async (id, input) => {
    const formData = new FormData();
    formData.append('group_name', input.group_name);
    if (input.description)
        formData.append('description', input.description);
    try {
        const response = await fetchWithAuth(GROUP_BY_ID_URL(id), {
            method: 'PUT',
            body: formData,
        });
        return response;
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to update group.');
    }
};
export const deleteGroup = async (id) => {
    try {
        const response = await fetchWithAuth(GROUP_BY_ID_URL(id), {
            method: 'DELETE',
        });
        return response;
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to delete group.');
    }
};
