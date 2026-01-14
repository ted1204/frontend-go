export class ApiError extends Error {
  public status: number;
  public data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const headers = {
    ...options.headers,
  };

  let response: Response;

  try {
    response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });
  } catch (networkError: any) {
    console.error('Fetch Network Error:', networkError);

    throw new ApiError(0, 'Network Error: Failed to connect to server (Possible CORS or Offline)', {
      originalError: networkError.message,
    });
  }
  if (response.status === 401) {
    localStorage.removeItem('userData');
    localStorage.removeItem('username');
    window.location.href = '/signin';
    throw new ApiError(401, 'Session expired. Please log in again.');
  }

  if (!response.ok) {
    let errorData: any;
    let errorMessage = '';

    try {
      const responseText = await response.text();
      try {
        errorData = JSON.parse(responseText);
        errorMessage = errorData.error || errorData.message || errorData.detail;
      } catch {
        errorMessage = responseText;
        errorData = { raw: responseText };
      }
    } catch {
      errorMessage = `Request failed with status ${response.status}`;
    }

    if (!errorMessage) {
      errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
    }

    throw new ApiError(response.status, errorMessage, errorData);
  }

  if (response.status === 204) {
    // Return a minimal object instead of null so callers can safely inspect status
    return { status: response.status };
  }

  return response.json();
};
