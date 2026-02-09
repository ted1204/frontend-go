export interface User {
  UID: number;
  Username: string;
  Email: string;
  CreatedAt: string;
  UpdatedAt: string;
  FullName?: string;
  IsSuperAdmin: boolean;
  Status: string;
  Type: string;
}

export interface UserRequest {
  username: string;
  password: string;
  email: string;
  role?: 'admin' | 'user';
}

export interface UserData {
  user_id: number;
  username: string;
  is_super_admin: boolean;
  role?: string;
}
