import { User } from './user';
import { Project } from './project';

export enum FormStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Completed = 'Completed',
  Rejected = 'Rejected',
}

export interface Form {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  user_id: number;
  project_id?: number;
  title: string;
  description: string;
  status: FormStatus;
  user?: User;
  project?: Project;
}

export interface CreateFormRequest {
  project_id?: number;
  title: string;
  description: string;
}

export interface UpdateFormStatusRequest {
  status: FormStatus;
}
