import { Schema, model, models, Types } from "mongoose";

export interface IListBook {
  bookId: Types.ObjectId;
  addedAt: Date;
}

export interface IList {
  userId: Types.ObjectId;

  name: string;

  color: string;

  books: IListBook[];
}

const ListBookSchema = new Schema<IListBook>(
  {
    bookId: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

const ListSchema = new Schema<IList>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    color: {
      type: String,
      required: true,
    },

    books: {
      type: [ListBookSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

ListSchema.index({ userId: 1 });

export default models.List || model<IList>("List", ListSchema);