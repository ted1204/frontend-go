import { LOGIN_URL, REGISTER_URL } from "../config/url"; // Adjust the import path as necessary
export interface LoginResponse {
  token: string;
  user_id: number;
  username: string;
  is_super_admin: boolean;
}

export interface ErrorResponse {
  error: string;
}

export interface MessageResponse {
  message: string;
}

export interface RegisterInput {
  username: string;
  password: string;
  email?: string;
  full_name?: string;
  type?: "origin" | "oauth2";
  status?: "online" | "offline" | "delete";
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  try {
    const response = await fetch(LOGIN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.error || `Login failed with status ${response.status}`);
    }

    const data: LoginResponse = await response.json();
    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Login failed, please try again.");
  }
};

export const register = async (input: RegisterInput): Promise<MessageResponse> => {
  const formData = new URLSearchParams();
  formData.append("username", input.username);
  formData.append("password", input.password);
  if (input.email) formData.append("email", input.email);
  if (input.full_name) formData.append("full_name", input.full_name);
  if (input.type) formData.append("type", input.type);
  if (input.status) formData.append("status", input.status);

  try {
    const response = await fetch(REGISTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.error || `Registration failed with status ${response.status}`);
    }

    const data: MessageResponse = await response.json();
    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Registration failed, please try again.");
  }
};