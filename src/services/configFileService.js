import { CONFIG_FILES_URL, CONFIG_FILE_BY_ID_URL, CONFIG_FILE_RESOURCES_URL, CONFIG_FILES_BY_PROJECT_URL, INSTANCE_BY_ID_URL, } from '../config/url';
import { fetchWithAuth as baseFetchWithAuth } from '../utils/api';
const fetchWithAuth = async (url, options = {}) => {
    const headers = {
        ...options.headers,
    };
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }
    return baseFetchWithAuth(url, { ...options, headers });
};
export const getConfigFiles = async () => {
    try {
        const response = await fetchWithAuth(CONFIG_FILES_URL, {
            method: 'GET',
        });
        return response;
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch config files.');
    }
};
export const createConfigFile = async (input) => {
    const formData = new FormData();
    formData.append('filename', input.filename);
    formData.append('raw_yaml', input.raw_yaml);
    formData.append('project_id', input.project_id.toString());
    try {
        const response = await fetchWithAuth(CONFIG_FILES_URL, {
            method: 'POST',
            body: formData,
        });
        return response;
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to create config file.');
    }
};
export const getConfigFileById = async (id) => {
    try {
        const response = await fetchWithAuth(CONFIG_FILE_BY_ID_URL(id), {
            method: 'GET',
        });
        return response;
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch config file.');
    }
};
export const updateConfigFile = async (id, input) => {
    const formData = new FormData();
    if (input.filename)
        formData.append('filename', input.filename);
    if (input.raw_yaml)
        formData.append('raw_yaml', input.raw_yaml);
    try {
        const response = await fetchWithAuth(CONFIG_FILE_BY_ID_URL(id), {
            method: 'PUT',
            body: formData,
        });
        return response;
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to update config file.');
    }
};
export const deleteConfigFile = async (id) => {
    try {
        const response = await fetchWithAuth(CONFIG_FILE_BY_ID_URL(id), {
            method: 'DELETE',
        });
        if (response.status === 204) {
            return { message: '204' };
        }
        return response;
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to delete config file.');
    }
};
export const getResourcesByConfigFile = async (id) => {
    try {
        const response = await fetchWithAuth(CONFIG_FILE_RESOURCES_URL(id), {
            method: 'GET',
        });
        return response;
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch resources.');
    }
};
export const getConfigFilesByProjectId = async (projectId) => {
    try {
        const response = await fetchWithAuth(CONFIG_FILES_BY_PROJECT_URL(projectId), {
            method: 'GET',
        });
        return response;
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch config files by project ID.');
    }
};
export const createInstance = async (id) => {
    try {
        return await fetchWithAuth(INSTANCE_BY_ID_URL(id), { method: 'POST' });
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to create instance.');
    }
};
export const deleteInstance = async (id) => {
    try {
        await fetchWithAuth(INSTANCE_BY_ID_URL(id), { method: 'DELETE' });
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to delete instance.');
    }
};
