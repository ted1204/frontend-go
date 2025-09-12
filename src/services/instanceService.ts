import { INSTANCE_BY_ID_URL } from "../config/url";
import { ErrorResponse, MessageResponse } from "../response/response"; // Adjust the import path as necessary

const fetchWithAuth = async (url: string, options: RequestInit) => {
  const token = localStorage.getItem("token");
  const headers = {
    ...options.headers,
    Authorization: token ? `Bearer ${token}` : "",
  };
  const response = await fetch(url, { ...options, headers });
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
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(INSTANCE_BY_ID_URL(id), {
      method: "DELETE",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
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