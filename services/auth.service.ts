// src/services/auth.service.ts
import axiosInstance from "@/lib/axios";
import {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from "@/types/auth.types";

export const AuthService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await axiosInstance.post("/auth/login", payload);
    return res.data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const res = await axiosInstance.post("/users/register", payload);
    return res.data;
  },
};
