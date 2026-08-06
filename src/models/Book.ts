import { Schema, model, models, Types } from "mongoose";
import { BookStatus } from "@/types/books";
import { BOOK_STATUS } from "@/lib/books";

export interface IBook {
  userId: Types.ObjectId;

  googleBookId?: string;

  title: string;
  authors: string[];

  description?: string;
  coverUrl?: string;

  categories: string[];
  pageCount?: number;
  publishedDate?: number;

  status: BookStatus;
  currentPage?: number;

  note?: string;
  tags: string[];

  completedAt?: Date;
}

const BookSchema = new Schema<IBook>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    googleBookId: String,

    title: {
      type: String,
      required: true,
      trim: true,
    },

    authors: {
      type: [String],
      required: true,
    },

    description: String,

    coverUrl: String,

    categories: {
      type: [String],
      default: [],
    },

    pageCount: Number,

    publishedDate: Number,

    currentPage: Number,

    note: String,

    tags: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: BOOK_STATUS,
      default: "WANT_TO_READ",
    },

    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

BookSchema.index({ userId: 1 });
BookSchema.index({ userId: 1, status: 1 });

BookSchema.index(
  {
    userId: 1,
    googleBookId: 1,
  },
  {
    unique: true,
    partialFilterExpression: { googleBookId: { $type: "string" } },
  }
);

export default models.Book || model<IBook>("Book", BookSchema);