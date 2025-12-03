import { User } from './user';
import { Project } from './project';

export enum TicketStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Completed = 'Completed',
  Rejected = 'Rejected',
}

export interface Ticket {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  user_id: number;
  project_id?: number;
  title: string;
  description: string;
  status: TicketStatus;
  user?: User;
  project?: Project;
}

export interface CreateTicketRequest {
  project_id?: number;
  title: string;
  description: string;
}

export interface UpdateTicketStatusRequest {
  status: TicketStatus;
}
