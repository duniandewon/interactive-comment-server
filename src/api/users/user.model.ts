import { Document, Model, Schema, model } from "mongoose";

import * as z from 'zod';

const UserSchema = new Schema<UserDocument, UserModel>({
  username: {
    type: String,
    required: true,
  },
});

export const ZUser = z.object({
  username: z.string()
})

export type ZUser  = z.infer<typeof ZUser>

interface UserBaseDocument extends ZUser, Document {}

export interface UserDocument extends UserBaseDocument {}

export interface UserModel extends Model<UserDocument> {}

export default model<UserDocument, UserModel>("user", UserSchema);
