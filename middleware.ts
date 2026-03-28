// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  userId: string;
  role: string;
  exp: number;
}

// ✅ Fully public — no token needed ever
const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
];

// ✅ Starts-with public — services browse + detail are public
const publicPrefixes = [
  "/services",
  "/payment/success",
  "/payment/fail",
  "/payment/cancel",
];

// ✅ Requires login — any role
const protectedPrefixes = ["/order", "/payment", "/dashboard"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;

  // 1. Always allow exact public routes
  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  // 2. Always allow public prefixes
  if (publicPrefixes.some((prefix) => path.startsWith(prefix))) {
    return NextResponse.next();
  }

  // 3. If not a protected route, allow through
  const isProtected = protectedPrefixes.some((prefix) =>
    path.startsWith(prefix),
  );
  if (!isProtected) {
    return NextResponse.next();
  }

  // 4. Protected route — check token
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", path); // save intended destination
    return NextResponse.redirect(loginUrl);
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    // 5. Token expired
    if (decoded.exp * 1000 < Date.now()) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      response.cookies.delete("user");
      return response;
    }

    const role = decoded.role;

    // 6. Role-based dashboard protection
    if (path.startsWith("/dashboard/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (path.startsWith("/dashboard/seller") && role !== "SELLER") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (path.startsWith("/dashboard/buyer") && role !== "BUYER") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // 7. Order + payment — only BUYER
    if (
      (path.startsWith("/order") || path.startsWith("/payment")) &&
      role !== "BUYER"
    ) {
      return NextResponse.redirect(
        new URL(`/dashboard/${role.toLowerCase()}`, request.url),
      );
    }

    return NextResponse.next();
  } catch {
    // Invalid token — clear cookies and redirect
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    response.cookies.delete("user");
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder files (png, jpg, svg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
