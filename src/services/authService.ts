import { LOGIN_URL, REGISTER_URL, LOGOUT_URL } from '../config/url'; // Adjust the import path as necessary
import { ErrorResponse, MessageResponse, LoginResponse } from '../response/response'; // Adjust the import path as necessary
import { RegisterInput } from '../interfaces/auth'; // Adjust the import path as necessary

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);
  console.log('in logging');
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

    localStorage.removeItem('username');
    sessionStorage.clear();

    console.log('Logged out successfully');
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Logout failed, please try again.');
  }
};

export const register = async (input: RegisterInput): Promise<MessageResponse> => {
  const formData = new URLSearchParams();
  formData.append('username', input.username);
  formData.append('password', input.password);
  if (input.email) formData.append('email', input.email);
  if (input.full_name) formData.append('full_name', input.full_name);
  if (input.type) formData.append('type', input.type);
  if (input.status) formData.append('status', input.status);

  try {
    const response = await fetch(REGISTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.error || `Registration failed with status ${response.status}`);
    }

    const data: MessageResponse = await response.json();
    return data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Registration failed, please try again.',
    );
  }
};

export const getUsername = (): string => {
  return localStorage.getItem('username') || '';
};
