import { NextRequest, NextResponse } from "next/server";

import { COOKIE_NAME } from "@/lib/cookies";
import { verifyToken } from "@/lib/auth";

const AUTH_ROUTES = ["/sign-in", "/sign-up"];
const PROTECTED_ROUTES = ["/app", "/library", "/lists"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  const token = request.cookies.get(COOKIE_NAME)?.value;

  let isAuthenticated = false;

  if (token) {
    const payload = await verifyToken(token);
    isAuthenticated = !!payload;
  }

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/app", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/home/:path*",
    "/library/:path*",
    "/lists/:path*",
    "/sign-in",
    "/sign-up",
  ],
};