import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { COOKIE_NAME } from "@/lib/cookies";
import { createBookSchema } from "@/lib/validations/book";
import Book from "@/models/Book";

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

    const docs = await Book.find({ userId }).sort({ updatedAt: -1 });
    const books = docs.map((doc) => ({
      id: doc._id.toString(),
      title: doc.title,
      authors: doc.authors,
      coverUrl: doc.coverUrl,
      status: doc.status,
      pageCount: doc.pageCount,
      currentPage: doc.currentPage,
      createdAt: doc.createdAt,
    }));

    return NextResponse.json({ books });
  } catch (err) {
    console.error("GET /api/books Error:", err);
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
    const result = createBookSchema.safeParse(body);

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
    await Book.syncIndexes();

    const { googleBookId, authors, ...restData } = result.data;
    const cleanGoogleBookId = googleBookId?.trim();
    const cleanAuthors = authors.map((a) => a.trim()).filter(Boolean);

    if (cleanGoogleBookId) {
      const existing = await Book.findOne({ userId, googleBookId: cleanGoogleBookId });
      if (existing) {
        return NextResponse.json(
          { error: "You have already saved this book to your library." },
          { status: 409 }
        );
      }
    }

    const bookData: Record<string, unknown> = {
      ...restData,
      authors: cleanAuthors.length > 0 ? cleanAuthors : ["Unknown Author"],
      userId,
    };

    if (cleanGoogleBookId) {
      bookData.googleBookId = cleanGoogleBookId;
    }

    const doc = await Book.create(bookData);

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

    return NextResponse.json({ book }, { status: 201 });
  } catch (err: unknown) {
    console.error("POST /api/books Error:", err);

    if (typeof err === "object" && err !== null && "code" in err && (err as { code?: number }).code === 11000) {
      return NextResponse.json(
        { error: "You have already saved this book to your library." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
