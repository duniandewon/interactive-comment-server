import { Types } from "mongoose";
import * as z from "zod";

export const ParamsWithId = z.object({
  id: z
    .string()
    .min(1)
    .refine(
      (val) => {
        const { ObjectId } = Types;

        try {
          return new ObjectId(val);
        } catch (error) {
          return false;
        }
      },
      {
        message: "Invalid ObjectId",
      }
    ),
});

export type ParamsWithId = z.infer<typeof ParamsWithId>;
