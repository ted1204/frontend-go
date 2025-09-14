import { INSTANCE_BY_ID_URL } from "../config/url";
import { ErrorResponse, MessageResponse } from "../response/response"; // Adjust the import path as necessary

const fetchWithAuth = async (url: string, options: RequestInit) => {
  const headers = {
    ...options.headers
  };
  const response = await fetch(url, { ...options, headers, credentials: 'include' });
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }
  return response.json();
};

export const instantiate = async (id: number): Promise<MessageResponse> => {
  try {
    const response = await fetchWithAuth(INSTANCE_BY_ID_URL(id), {
      method: "POST",
    });
    return response as MessageResponse;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to instantiate.");
  }
};

export const destruct = async (id: number): Promise<void> => {
  try {
    const response = await fetch(INSTANCE_BY_ID_URL(id), {
      method: "DELETE",
      credentials: 'include'
    });
    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }
    // For 204 No Content, no need to parse JSON
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to destruct.");
  }
};