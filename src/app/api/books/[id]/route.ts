import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { COOKIE_NAME } from "@/lib/cookies";
import { updateBookSchema } from "@/lib/validations/book";
import Book from "@/models/Book";
import List from "@/models/List";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id || id === "undefined") {
      return NextResponse.json({ error: "Invalid book ID." }, { status: 400 });
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

    const doc = await Book.findOne({ _id: id, userId });
    if (!doc) {
      return NextResponse.json({ error: "Book not found." }, { status: 404 });
    }

    const book = {
      id: doc._id.toString(),
      title: doc.title,
      authors: doc.authors,
      coverUrl: doc.coverUrl,
      status: doc.status,
      pageCount: doc.pageCount,
      currentPage: doc.currentPage,
      createdAt: doc.createdAt,
    };

    return NextResponse.json({ book });
  } catch (err) {
    console.error("GET /api/books/[id] Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id || id === "undefined") {
      return NextResponse.json({ error: "Invalid book ID." }, { status: 400 });
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
    const result = updateBookSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed.",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    await connectDB();

    const updatePayload: Record<string, unknown> = { ...result.data };
    if (result.data.status === "COMPLETED" && !result.data.completedAt) {
      updatePayload.completedAt = new Date();
    }

    const doc = await Book.findOneAndUpdate(
      { _id: id, userId },
      { $set: updatePayload },
      { new: true, runValidators: true }
    );

    if (!doc) {
      return NextResponse.json({ error: "Book not found." }, { status: 404 });
    }

    const book = {
      id: doc._id.toString(),
      title: doc.title,
      authors: doc.authors,
      coverUrl: doc.coverUrl,
      status: doc.status,
      pageCount: doc.pageCount,
      currentPage: doc.currentPage,
      createdAt: doc.createdAt,
    };

    return NextResponse.json({ book });
  } catch (err) {
    console.error("PATCH /api/books/[id] Error:", err);
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
      return NextResponse.json({ error: "Invalid book ID." }, { status: 400 });
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

    const book = await Book.findOneAndDelete({ _id: id, userId });
    if (!book) {
      return NextResponse.json({ error: "Book not found." }, { status: 404 });
    }

    await List.updateMany(
      { userId },
      { $pull: { books: { bookId: id } } }
    );

    return NextResponse.json({ message: "Book deleted successfully." });
  } catch (err) {
    console.error("DELETE /api/books/[id] Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
