import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

function getSecret(): Uint8Array {
  const secretStr = process.env.JWT_SECRET || "nook-default-jwt-secret-key-change-in-production";
  return new TextEncoder().encode(secretStr);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

export async function signToken(userId: string): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.sub ?? null;
  } catch {
    return null;
  }
}