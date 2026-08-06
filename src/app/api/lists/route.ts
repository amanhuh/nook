import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { COOKIE_NAME } from "@/lib/cookies";
import List from "@/models/List";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const userId = await verifyToken(token);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await connectDB();

    const listsDocs = await List.find({ userId }).sort({ createdAt: -1 });
    const lists = listsDocs.map((doc) => ({
      id: doc._id.toString(),
      name: doc.name,
      color: doc.color || "#78716c",
      bookCount: doc.books ? doc.books.length : 0,
    }));

    return NextResponse.json({ lists });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const userId = await verifyToken(token);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const name = body?.name ? String(body.name).trim() : "";

    if (!name) {
      return NextResponse.json(
        { error: "Collection name cannot be empty." },
        { status: 400 }
      );
    }

    if (name.length > 30) {
      return NextResponse.json(
        { error: "Collection name must be 30 characters or less." },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await List.findOne({ userId, name: new RegExp(`^${name}$`, "i") });
    if (existing) {
      return NextResponse.json(
        { error: "Collection already exists." },
        { status: 400 }
      );
    }

    const doc = await List.create({
      userId,
      name,
      color: "#78716c",
      books: [],
    });

    return NextResponse.json(
      {
        list: {
          id: doc._id.toString(),
          name: doc.name,
          color: doc.color,
          bookCount: 0,
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
