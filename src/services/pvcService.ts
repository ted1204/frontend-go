import {
  PVC_CREATE_URL,
  PVC_EXPAND_URL,
  PVC_LIST_URL,
  PVC_GET_URL,
  PVC_DELETE_URL,
} from "../config/url";

export interface PVC {
  name: string;
  namespace: string;
  size: string;
  status: string;
}

export interface PVCRequest {
  name: string;
  namespace: string;
  size: string;
  storageClassName: string;
}

export interface ErrorResponse {
  error: string;
}

export interface MessageResponse {
  message: string;
}

// 帶認證的 fetch
const fetchWithAuth = async (url: string, options: RequestInit) => {
  const token = localStorage.getItem("token"); // 假設 token 存儲在 localStorage
  const headers = {
    ...options.headers,
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: token ? `Bearer ${token}` : "",
  };
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }
  return response.json();
};

// 不帶認證的 fetch
const fetchWithoutAuth = async (url: string, options: RequestInit) => {
  const headers = {
    ...options.headers,
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }
  return response.json();
};

export const createPVC = async (input: PVCRequest): Promise<{ [key: string]: string }> => {
  const formData = new URLSearchParams();
  formData.append("name", input.name);
  formData.append("namespace", input.namespace);
  formData.append("size", input.size);
  formData.append("storageClassName", input.storageClassName);

  try {
    const response = await fetchWithAuth(PVC_CREATE_URL, {
      method: "POST",
      body: formData,
    });
    return response as { [key: string]: string };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to create PVC.");
  }
};

export const expandPVC = async (input: PVCRequest): Promise<{ [key: string]: string }> => {
  const formData = new URLSearchParams();
  formData.append("name", input.name);
  formData.append("namespace", input.namespace);
  formData.append("size", input.size);
  formData.append("storageClassName", input.storageClassName);

  try {
    const response = await fetchWithAuth(PVC_EXPAND_URL, {
      method: "PUT",
      body: formData,
    });
    return response as { [key: string]: string };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to expand PVC.");
  }
};

export const getPVCList = async (namespace: string): Promise<PVC> => {
  try {
    const response = await fetchWithoutAuth(PVC_LIST_URL(namespace), {
      method: "GET",
    });
    return response as PVC;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch PVC list.");
  }
};

export const getPVC = async (namespace: string, name: string): Promise<PVC> => {
  try {
    const response = await fetchWithoutAuth(PVC_GET_URL(namespace, name), {
      method: "GET",
    });
    return response as PVC;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch PVC.");
  }
};

export const deletePVC = async (namespace: string, name: string): Promise<{ [key: string]: string }> => {
  try {
    const response = await fetchWithAuth(PVC_DELETE_URL(namespace, name), {
      method: "DELETE",
    });
    return response as { [key: string]: string };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to delete PVC.");
  }
};