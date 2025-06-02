import axios from "axios";
import { apiClient } from "./client";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  address: string;
  privateKey: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/api/auth/register", data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/api/auth/login", data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>("/api/auth/me");
    return response.data;
  }
};
