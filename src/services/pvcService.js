import { PVC_CREATE_URL, PVC_EXPAND_URL, PVC_LIST_URL, PVC_LIST_BY_PROJECT_URL, PVC_GET_URL, PVC_DELETE_URL, PVC_FILEBROWSER_START_URL, PVC_FILEBROWSER_STOP_URL, } from '../config/url';
import { fetchWithAuth as baseFetchWithAuth } from '../utils/api';
const fetchWithAuth = async (url, options) => {
    const headers = {
        ...options.headers,
        'Content-Type': 'application/json',
    };
    return baseFetchWithAuth(url, { ...options, headers });
};
const fetchWithAuthForm = async (url, options) => {
    const headers = {
        ...options.headers,
        'Content-Type': 'application/x-www-form-urlencoded',
    };
    return baseFetchWithAuth(url, { ...options, headers });
};
export const createPVC = async (input) => {
    const formData = new URLSearchParams();
    formData.append('name', input.name);
    formData.append('namespace', input.namespace);
    formData.append('size', input.size);
    formData.append('storageClassName', input.storageClassName);
    try {
        const response = await fetchWithAuthForm(PVC_CREATE_URL, {
            method: 'POST',
            body: formData,
        });
        return response;
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to create PVC.');
    }
};
export const expandPVC = async (input) => {
    const formData = new URLSearchParams();
    formData.append('name', input.name);
    formData.append('namespace', input.namespace);
    formData.append('size', input.size);
    formData.append('storageClassName', input.storageClassName);
    try {
        const response = await fetchWithAuthForm(PVC_EXPAND_URL, {
            method: 'PUT',
            body: formData,
        });
        return response;
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to expand PVC.');
    }
};
export const getPVCList = async (namespace) => {
    try {
        const response = await fetchWithAuth(PVC_LIST_URL(namespace), {
            method: 'GET',
        });
        return response.data;
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch PVC list.');
    }
};
export const getPVCListByProject = async (pid) => {
    try {
        const response = await fetchWithAuth(PVC_LIST_BY_PROJECT_URL(pid), {
            method: 'GET',
        });
        return response.data;
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch PVC list.');
    }
};
export const getPVC = async (namespace, name) => {
    try {
        const response = await fetchWithAuth(PVC_GET_URL(namespace, name), {
            method: 'GET',
        });
        return response.data;
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch PVC.');
    }
};
export const deletePVC = async (namespace, name) => {
    try {
        const response = await fetchWithAuthForm(PVC_DELETE_URL(namespace, name), {
            method: 'DELETE',
        });
        return response;
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to delete PVC.');
    }
};
export const startFileBrowser = async (namespace, pvcName) => {
    try {
        const response = await fetchWithAuth(PVC_FILEBROWSER_START_URL, {
            method: 'POST',
            body: JSON.stringify({ namespace, pvc_name: pvcName }),
        });
        return response.data;
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to start file browser.');
    }
};
export const stopFileBrowser = async (namespace, pvcName) => {
    try {
        await fetchWithAuth(PVC_FILEBROWSER_STOP_URL, {
            method: 'POST',
            body: JSON.stringify({ namespace, pvc_name: pvcName }),
        });
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to stop file browser.');
    }
};
