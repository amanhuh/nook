import { Schema, model, models, Types } from "mongoose";

export interface IList {
  userId: Types.ObjectId;
  name: string;
  color?: string;
}

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
    },
  },
  {
    timestamps: true,
  }
);

ListSchema.index({ userId: 1 });

const List = models.List || model<IList>("List", ListSchema);

export default List;
