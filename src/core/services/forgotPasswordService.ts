import { FORGOT_PASSWORD_URL } from '../config/url';
import { ErrorResponse, MessageResponse } from '../response/response';

export const forgotPassword = async (
  username: string,
  newPassword: string,
): Promise<MessageResponse> => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('new_password', newPassword);

  try {
    const response = await fetch(FORGOT_PASSWORD_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.error || `Password reset failed with status ${response.status}`);
    }

    const data: MessageResponse = await response.json();
    return data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Password reset failed, please try again.',
    );
  }
};
