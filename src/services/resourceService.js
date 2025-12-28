import { RESOURCES_URL, RESOURCE_BY_ID_URL, CONFIG_FILE_BY_ID_URL } from '../config/url';
import { fetchWithAuth } from '../utils/api';
export const getResourceById = async (id) => {
    try {
        const response = await fetchWithAuth(RESOURCE_BY_ID_URL(id), {
            method: 'GET',
        });
        return response;
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch resource.');
    }
};
export const updateResource = async (id, input) => {
    const formData = new FormData();
    if (input.name)
        formData.append('name', input.name);
    if (input.type)
        formData.append('type', input.type);
    if (input.parsed_yaml)
        formData.append('parsed_yaml', input.parsed_yaml);
    if (input.description)
        formData.append('description', input.description);
    try {
        const response = await fetchWithAuth(RESOURCE_BY_ID_URL(id), {
            method: 'PUT',
            body: formData,
        });
        return response;
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to update resource.');
    }
};
export const deleteResource = async (id) => {
    try {
        const response = await fetchWithAuth(RESOURCE_BY_ID_URL(id), {
            method: 'DELETE',
        });
        return response;
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to delete resource.');
    }
};
export const getResources = async () => {
    try {
        const response = await fetchWithAuth(RESOURCES_URL, {
            method: 'GET',
        });
        return response;
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch resources.');
    }
};
export const getResourcesByConfigFile = async (cfId) => {
    try {
        const response = await fetchWithAuth(`${CONFIG_FILE_BY_ID_URL(cfId)}/resources`, {
            // Wrap with your base URL
            method: 'GET',
        });
        return response;
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch resources by config file.');
    }
};
