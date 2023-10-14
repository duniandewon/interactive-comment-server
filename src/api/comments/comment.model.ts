import { Document, Model, Schema, Types, model, Query } from "mongoose";
import * as z from "zod";

const CommentSchema = new Schema<CommentDocument, CommentModel>(
  {
    content: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    user: {
      type: String,
      ref: "user",
    },
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "comment",
      },
    ],
    mention: {
      type: String,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "comment",
    },
  },
  {
    timestamps: true,
  }
);

export const ZComment = z.object({
  content: z.string(),
  score: z.number(),
  user: z.string(),
  mention: z.string().optional(),
  parentId: z.string().optional(),
});

export type ZComment = z.infer<typeof ZComment>;

interface CommentBaseDocument extends ZComment, Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentDocument extends CommentBaseDocument {
  replies?: Types.Array<CommentBaseDocument>;
}

export interface CommentModel extends Model<CommentDocument> {}

CommentSchema.pre<CommentDocument>(
  "save",
  async function (this: CommentDocument, next) {
    if (!this.parentId) return next();

    try {
      const Comment = model<CommentDocument, CommentModel>("comment");

      const parentComment = await Comment.findById(this.parentId);

      if (!parentComment) return next(new Error("Parent comment not found"));

      parentComment?.replies?.push(this._id);

      await parentComment?.save();
    } catch (error) {
      console.log("error happend:", error);
      return next();
    }
  }
);

CommentSchema.post<Query<CommentDocument, CommentDocument>>(
  "findOneAndDelete",
  async function (doc, next) {
    console.log("Comment ID", doc._id);
    if (!doc.parentId) return next();
    try {
      const parentComment: CommentDocument | null = await this.model.findById(
        doc.parentId
      );

      if (!parentComment) return next(new Error("Parrent comment not found"));

      parentComment.replies?.pull({ _id: doc._id });

      await parentComment.save();
    } catch (error) {
      console.log("error happend:", error);
      return next();
    }
  }
);

export default model<CommentDocument, CommentModel>("comment", CommentSchema);
