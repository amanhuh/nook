import { cookies } from "next/headers";

const COOKIE_NAME = "auth_token";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, COOKIE_OPTIONS);
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();

  cookieStore.delete(COOKIE_NAME);
}

export { COOKIE_NAME };
