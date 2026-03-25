// src/types/auth.types.ts
export type Role = "BUYER" | "SELLER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  profileImage?: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: User;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
}
