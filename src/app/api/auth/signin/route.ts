import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { verifyPassword, signToken } from "@/lib/auth";
import { setAuthCookie } from "@/lib/cookies";
import { signInSchema } from "@/lib/validations/auth";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = signInSchema.safeParse(body);

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

    const { email, password } = result.data;

    await connectDB();

    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user) {
      return NextResponse.json(
        {
          error: "No account found with this email.",
          fieldErrors: { email: "No account found with this email." },
        },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        {
          error: "Incorrect password. Please try again.",
          fieldErrors: { password: "Incorrect password. Please try again." },
        },
        { status: 401 }
      );
    }

    const token = await signToken(user._id.toString());
    await setAuthCookie(token);

    return NextResponse.json({
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("POST /api/auth/signin Error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
