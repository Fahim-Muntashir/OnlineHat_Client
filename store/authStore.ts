// src/store/authStore.ts
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { User } from "@/types/auth.types";

interface JwtPayload {
  userId: string;
  role: string;
  exp: number;
}

export const AuthStore = {
  saveAuth: (token: string, user: User) => {
    Cookies.set("token", token, { expires: 7 });
    Cookies.set("user", JSON.stringify(user), { expires: 7 });
  },

  getToken: (): string | undefined => {
    return Cookies.get("token");
  },

  getUser: (): User | null => {
    const user = Cookies.get("user");
    return user ? JSON.parse(user) : null;
  },

  isTokenValid: (): boolean => {
    const token = Cookies.get("token");
    if (!token) return false;
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },

  clearAuth: () => {
    Cookies.remove("token");
    Cookies.remove("user");
  },
};
