import { Schema, model, models, Types } from "mongoose";
import { BOOK_STATUS, BookStatus } from "@/types/books";

export interface IBook {
  userId: Types.ObjectId;
  title: string;
  authors: string[];
  description?: string;
  coverUrl?: string;
  tags: string[];
  status: BookStatus;
  lists: Types.ObjectId[];
  completedAt?: Date;
}

const BookSchema = new Schema<IBook>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    authors: {
      type: [String],
      required: true,
    },

    description: {
      type: String,
    },

    coverUrl: {
      type: String,
    },

    tags: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: BOOK_STATUS,
      default: "WANT_TO_READ",
    },

    lists: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "List",
        },
      ],
      default: [],
    },

    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

BookSchema.index({ userId: 1 });
BookSchema.index({ userId: 1, status: 1 });

const Book = models.Book || model<IBook>("Book", BookSchema);

export default Book;