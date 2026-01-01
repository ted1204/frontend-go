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
