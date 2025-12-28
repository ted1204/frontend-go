import { USER_GROUP_URL, USER_GROUP_BY_GROUP_URL, USER_GROUP_BY_USER_URL } from '../config/url';
import { fetchWithAuth as baseFetchWithAuth } from '../utils/api';
const fetchWithAuth = async (url, options) => {
    const headers = {
        ...options.headers,
        'Content-Type': 'application/x-www-form-urlencoded',
    };
    // if JSON
    if (options.body && typeof options.body === 'string' && options.body.startsWith('{')) {
        headers['Content-Type'] = 'application/json';
    }
    return baseFetchWithAuth(url, { ...options, headers });
};
export const getUserGroup = async (u_id, g_id) => {
    try {
        const response = await fetchWithAuth(`${USER_GROUP_URL}?u_id=${u_id}&g_id=${g_id}`, {
            method: 'GET',
        });
        return response;
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch user-group.');
    }
};
export const createUserGroup = async (input) => {
    const payload = new URLSearchParams({
        u_id: input.u_id.toString(),
        g_id: input.g_id.toString(),
        role: input.role,
    });
    try {
        const response = await fetchWithAuth(USER_GROUP_URL, {
            method: 'POST',
            body: payload.toString(),
        });
        return response;
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to create.');
    }
};
export const updateUserGroup = async (input) => {
    const payload = new URLSearchParams({
        u_id: input.u_id.toString(),
        g_id: input.g_id.toString(),
        role: input.role,
    });
    try {
        const response = await fetchWithAuth(USER_GROUP_URL, {
            method: 'PUT',
            body: payload.toString(),
        });
        return response;
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to update user-group.');
    }
};
export const deleteUserGroup = async (input) => {
    try {
        const response = await fetchWithAuth(`${USER_GROUP_URL}?u_id=${input.u_id}&g_id=${input.g_id}`, {
            method: 'DELETE',
        });
        if (response.status === 204) {
            return { message: '204' };
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to delete user-group.');
    }
};
export const getUsersByGroup = async (g_id) => {
    try {
        const response = await fetchWithAuth(`${USER_GROUP_BY_GROUP_URL}?g_id=${g_id}`, {
            method: 'GET',
        });
        const successResponse = response;
        const groupData = successResponse.data[g_id.toString()];
        return groupData?.Users ?? [];
    }
    catch (error) {
        console.error('Fetch users by group error:', error);
        return [];
    }
};
export const getGroupsByUser = async (u_id) => {
    try {
        const response = await fetchWithAuth(`${USER_GROUP_BY_USER_URL}?u_id=${u_id}`, {
            method: 'GET',
        });
        const successResponse = response;
        const userData = successResponse.data[u_id.toString()];
        return userData.Groups || [];
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch groups by user.');
    }
};
