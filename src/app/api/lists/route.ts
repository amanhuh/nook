import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { COOKIE_NAME } from "@/lib/cookies";
import { createListSchema } from "@/lib/validations/list";
import { LIST_COLORS } from "@/lib/constants";
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
      color: doc.color || "#C7CED9",
      bookCount: doc.books ? doc.books.length : 0,
      books: doc.books || [],
    }));

    return NextResponse.json({ lists });
  } catch (err) {
    console.error("GET /api/lists Error:", err);
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
    const result = createListSchema.safeParse(body);

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

    const existing = await List.findOne({
      userId,
      name: new RegExp(`^${result.data.name}$`, "i"),
    });

    if (existing) {
      return NextResponse.json(
        { error: "A list with this name already exists." },
        { status: 400 }
      );
    }

    const hexColor = LIST_COLORS[result.data.colorName]?.hex || "#C7CED9";

    const listBooks = result.data.books
      .filter((id) => Types.ObjectId.isValid(id))
      .map((id) => ({
        bookId: new Types.ObjectId(id),
        addedAt: new Date(),
      }));

    const doc = await List.create({
      userId,
      name: result.data.name,
      color: hexColor,
      books: listBooks,
    });

    return NextResponse.json(
      {
        list: {
          id: doc._id.toString(),
          name: doc.name,
          color: doc.color,
          bookCount: doc.books.length,
          books: doc.books,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/lists Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
