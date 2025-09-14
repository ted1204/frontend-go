export interface ErrorResponse {
  error: string;
}
export interface MessageResponse {
  message: string;
}
export interface LoginResponse {
  user_id: number;
  username: string;
  is_super_admin: boolean;
}

