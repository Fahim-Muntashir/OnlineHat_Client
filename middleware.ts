// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  userId: string;
  role: string;
  exp: number;
}

const publicRoutes = ["/login", "/register", "/"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;

  if (publicRoutes.includes(path)) return NextResponse.next();

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    if (decoded.exp * 1000 < Date.now()) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }

    const role = decoded.role;

    if (path.startsWith("/dashboard/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (path.startsWith("/dashboard/seller") && role !== "SELLER") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (path.startsWith("/dashboard/buyer") && role !== "BUYER") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
