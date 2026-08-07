import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { hashPassword, signToken } from "@/lib/auth";
import { setAuthCookie } from "@/lib/cookies";
import { signUpSchema } from "@/lib/validations/auth";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = signUpSchema.safeParse(body);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const path = issue.path[0];
        if (typeof path === "string" && !fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      }

      return NextResponse.json(
        {
          error: result.error.issues[0]?.message || "Invalid input.",
          fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          error: "An account with this email already exists.",
          fieldErrors: { email: "An account with this email already exists." },
        },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      passwordHash,
    });

    const token = await signToken(user._id.toString());
    await setAuthCookie(token);

    return NextResponse.json(
      {
        user: { id: user._id, name: user.name, email: user.email },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/auth/signup Error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
