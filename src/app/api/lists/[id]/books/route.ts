import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { COOKIE_NAME } from "@/lib/cookies";
import List, { IListBook } from "@/models/List";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id || id === "undefined") {
      return NextResponse.json({ error: "Invalid list ID." }, { status: 400 });
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

    const body = await req.json();
    const { bookIds } = body;

    if (!Array.isArray(bookIds) || bookIds.length === 0) {
      return NextResponse.json({ error: "No books specified." }, { status: 400 });
    }

    const validObjectIds = bookIds
      .filter((bId: string) => Types.ObjectId.isValid(bId))
      .map((bId: string) => new Types.ObjectId(bId));

    if (validObjectIds.length === 0) {
      return NextResponse.json({ error: "Invalid book IDs." }, { status: 400 });
    }

    await connectDB();

    const list = await List.findOne({ _id: id, userId });
    if (!list) {
      return NextResponse.json({ error: "List not found." }, { status: 404 });
    }

    const existingBookIds = new Set(
      list.books.map((b: IListBook) => b.bookId.toString())
    );

    const newBookObjects = validObjectIds
      .filter((bId) => !existingBookIds.has(bId.toString()))
      .map((bId) => ({ bookId: bId, addedAt: new Date() }));

    if (newBookObjects.length > 0) {
      await List.updateOne(
        { _id: id, userId },
        { $push: { books: { $each: newBookObjects } } }
      );
    }

    return NextResponse.json({ message: "Books added to list successfully." });
  } catch (err) {
    console.error("POST /api/lists/[id]/books Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id || id === "undefined") {
      return NextResponse.json({ error: "Invalid list ID." }, { status: 400 });
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

    const body = await req.json();
    const { bookIds } = body;

    if (!Array.isArray(bookIds) || bookIds.length === 0) {
      return NextResponse.json({ error: "No books specified." }, { status: 400 });
    }

    const validObjectIds = bookIds
      .filter((bId: string) => Types.ObjectId.isValid(bId))
      .map((bId: string) => new Types.ObjectId(bId));

    if (validObjectIds.length === 0) {
      return NextResponse.json({ error: "Invalid book IDs." }, { status: 400 });
    }

    await connectDB();

    const result = await List.updateOne(
      { _id: id, userId },
      { $pull: { books: { bookId: { $in: validObjectIds } } } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "List not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Books removed from list successfully." });
  } catch (err) {
    console.error("DELETE /api/lists/[id]/books Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
