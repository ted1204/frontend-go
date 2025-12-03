import { ErrorResponse } from "../response/response";

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const headers = {
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers, credentials: 'include' });

  if (response.status === 401) {
    // Clear user data
    localStorage.removeItem('userData');
    localStorage.removeItem('username');
    
    // Redirect to signin page
    window.location.href = '/signin';
    
    // Throw an error to stop further execution
    throw new Error('Session expired. Please log in again.');
  }

  if (!response.ok) {
    let errorData: ErrorResponse | undefined;
    try {
      errorData = await response.json();
    } catch (e) {
      // If response is not JSON, ignore
    }
    throw new Error(errorData?.error || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};
