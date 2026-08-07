import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/cookies";
import { verifyToken } from "@/lib/auth";

const AUTH_ROUTES = ["/sign-in", "/sign-up"];
const PROTECTED_ROUTES = ["/home", "/library", "/lists", "/books"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  const token = request.cookies.get(COOKIE_NAME)?.value;

  let isAuthenticated = false;

  if (token) {
    const payload = await verifyToken(token);
    isAuthenticated = !!payload;
  }

  if (isProtectedRoute && !isAuthenticated) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/home/:path*",
    "/library/:path*",
    "/lists/:path*",
    "/books/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
