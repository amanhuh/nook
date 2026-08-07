import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { COOKIE_NAME } from "@/lib/cookies";
import List from "@/models/List";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id || id === "undefined") {
      return NextResponse.json({ error: "Invalid collection ID." }, { status: 400 });
    }

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

    const doc = await List.findOne({ _id: id, userId });
    if (!doc) {
      return NextResponse.json({ error: "Collection not found." }, { status: 404 });
    }

    const list = {
      id: doc._id.toString(),
      name: doc.name,
      color: doc.color,
      bookCount: doc.books ? doc.books.length : 0,
      books: doc.books || [],
    };

    return NextResponse.json({ list });
  } catch (err) {
    console.error("GET /api/lists/[id] Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id || id === "undefined") {
      return NextResponse.json({ error: "Invalid collection ID." }, { status: 400 });
    }

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

    const list = await List.findOneAndDelete({ _id: id, userId });
    if (!list) {
      return NextResponse.json({ error: "Collection not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Collection deleted successfully." });
  } catch (err) {
    console.error("DELETE /api/lists/[id] Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
