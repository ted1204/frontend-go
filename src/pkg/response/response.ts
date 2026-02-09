export type { ErrorResponse, MessageResponse } from '@/pkg/types/error';

export interface LoginResponse {
  user_id: number;
  username: string;
  is_super_admin: boolean;
}
