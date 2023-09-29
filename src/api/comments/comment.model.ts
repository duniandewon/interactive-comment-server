import { Document, Model, ObjectId, Schema, model } from "mongoose";
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
    replies: [{
      type: Schema.Types.ObjectId,
      ref: "comment",
    }],
    replyingTo: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const BaseComment = z.object({
  content: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  score: z.number(),
  user: z.string(),
  replyingTo: z.string().optional(),
});

export interface ZComment extends z.infer<typeof BaseComment> {
  replies?: z.infer<typeof BaseComment>[];
}

export const ZComment = BaseComment.extend({
  replies: z.array(BaseComment).optional(),
});

interface UserBaseDocument extends ZComment, Document {}

export interface CommentDocument extends UserBaseDocument {}

export interface CommentModel extends Model<CommentDocument> {}

export default model<CommentDocument, CommentModel>("comment", CommentSchema);
