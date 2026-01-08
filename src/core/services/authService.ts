import { LOGIN_URL, REGISTER_URL, LOGOUT_URL } from '../config/url'; // Adjust the import path as necessary
import { ErrorResponse, MessageResponse, LoginResponse } from '../response/response'; // Adjust the import path as necessary
import { RegisterInput } from '../interfaces/auth'; // Adjust the import path as necessary

const appendIfPresent = (formData: URLSearchParams, key: string, value: string | undefined) => {
  if (value !== undefined && value !== null && value !== '') {
    formData.append(key, value);
  }
};

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);
  // console.log('in logging');
  try {
    const response = await fetch(LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.error || `Login failed with status ${response.status}`);
    }
    const data: LoginResponse = await response.json();
    localStorage.setItem('username', data.username);
    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Login failed, please try again.');
  }
};

export const logout = async (): Promise<void> => {
  try {
    const response = await fetch(LOGOUT_URL, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Logout failed with status ${response.status}`);
    }
    
    localStorage.clear();
    sessionStorage.clear();

    document.cookie.split(';').forEach((cookie) => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
      document.cookie =
        name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=' + window.location.hostname;
    });

    // console.log('Logged out successfully');
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Logout failed, please try again.');
  }
};

export const register = async (input: RegisterInput): Promise<MessageResponse> => {
  const formData = new URLSearchParams();
  formData.append('username', input.username);
  formData.append('password', input.password);
  appendIfPresent(formData, 'email', input.email);
  appendIfPresent(formData, 'full_name', input.full_name);
  appendIfPresent(formData, 'type', input.type);
  appendIfPresent(formData, 'status', input.status);

  try {
    const response = await fetch(REGISTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
      credentials: 'include',
    });
    console.log(formData.toString())
    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.error || `Registration failed with status ${response.status}`);
    }

    const data: MessageResponse = await response.json();
    return data;
  } catch (error) {
    console.log(formData.toString())
    throw new Error(
      error instanceof Error ? error.message : 'Registration failed, please try again.',
    );
  }
};

export const getUsername = (): string => {
  return localStorage.getItem('username') || '';
};
