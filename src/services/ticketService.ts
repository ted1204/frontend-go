import { API_BASE_URL } from '../config/url';
import { Ticket, CreateTicketRequest } from '../interfaces/ticket';
import { fetchWithAuth as baseFetchWithAuth } from "../utils/api";

const fetchWithAuth = async (url: string, options: RequestInit) => {
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
  };
  return baseFetchWithAuth(url, { ...options, headers });
};


export const createTicket = async (data: CreateTicketRequest): Promise<Ticket> => {
  const response = await fetchWithAuth(`${API_BASE_URL}/tickets`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.data;
};

export const getMyTickets = async (): Promise<Ticket[]> => {
  const response = await fetchWithAuth(`${API_BASE_URL}/tickets/my`, {
    method: 'GET',
  });
  return response.data;
};

export const getAllTickets = async (): Promise<Ticket[]> => {
  const response = await fetchWithAuth(`${API_BASE_URL}/tickets`, {
    method: 'GET',
  });
  return response.data;
};

export const updateTicketStatus = async (id: number, status: string): Promise<Ticket> => {
  const response = await fetchWithAuth(`${API_BASE_URL}/tickets/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
  return response.data;
};
