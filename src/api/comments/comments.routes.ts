import { Router } from "express";

import { deleteComment, getAllComments, postComment, postReply, updateComment } from "./comments.controller";

import { validateRequest } from "src/middlewares";

import { ZComment } from "./comment.model";
import { ParamsWithId } from "src/interface/ParamsWithId";

const router = Router();

router.get("/", getAllComments);

router.post(
  "/",
  validateRequest({
    body: ZComment,
  }),
  postComment
);

router.post(
  "/:id",
  validateRequest({
    params: ParamsWithId,
    body: ZComment,
  }),
  postReply
);

router.put(
  "/:id",
  validateRequest({
    params: ParamsWithId,
    body: ZComment,
  }),
  updateComment
);

router.delete("/:id", deleteComment)

export default router;
