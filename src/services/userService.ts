import { USERS_URL, USER_BY_ID_URL } from "../config/url";
import { ErrorResponse, MessageResponse } from "../response/response";
import { User, UserRequest } from "../interfaces/user";

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

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await fetchWithAuth(USERS_URL, {
      method: "GET",
    });
    return response as User[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch users.");
  }
};

// export const createUser = async (input: UserRequest): Promise<User> => {
//   const formData = new URLSearchParams();
//   formData.append("username", input.username);
//   formData.append("password", input.password);
//   formData.append("email", input.email);
//   if (input.role) formData.append("role", input.role);

//   try {
//     const response = await fetchWithAuth(USERS_URL, {
//       method: "POST",
//       body: formData,
//     });
//     return response as User;
//   } catch (error) {
//     throw new Error(error instanceof Error ? error.message : "Failed to create user.");
//   }
// };

export const getUserById = async (id: number): Promise<User> => {
  try {
    const response = await fetchWithAuth(USER_BY_ID_URL(id), {
      method: "GET",
    });
    return response as User;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch user.");
  }
};

export const updateUser = async (id: number, input: Partial<UserRequest>): Promise<User> => {
  const formData = new URLSearchParams();
  if (input.username) formData.append("username", input.username);
  if (input.password) formData.append("password", input.password);
  if (input.email) formData.append("email", input.email);
  if (input.role) formData.append("role", input.role);

  try {
    const response = await fetchWithAuth(USER_BY_ID_URL(id), {
      method: "PUT",
      body: formData,
    });
    return response as User;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to update user.");
  }
};

export const deleteUser = async (id: number): Promise<MessageResponse> => {
  try {
    const response = await fetchWithAuth(USER_BY_ID_URL(id), {
      method: "DELETE",
    });
    return response as MessageResponse;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to delete user.");
  }
};