import { NextFunction, Request, Response } from "express";

import MessageResponse from "src/interface/MessageResponse";

import Comment, { CommentDocument, ZComment } from "./comment.model";
import { ParamsWithId } from "src/interface/ParamsWithId";

export async function getAllComments(
  req: Request,
  res: Response<MessageResponse<CommentDocument[]>>,
  next: NextFunction
) {
  try {
    const comments = await Comment.find({ mention: { $exists: false } })
      .populate("user")
      .populate({
        path: "replies",
        populate: {
          path: "user",
        },
      });

    res.json({
      data: comments,
      meta: {
        code: 200,
        message: "success",
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function postComment(
  req: Request<{}, CommentDocument, ZComment>,
  res: Response<MessageResponse<CommentDocument>>,
  next: NextFunction
) {
  try {
    const newComment: CommentDocument = new Comment(req.body);

    await newComment.save();

    res.json({
      data: newComment,
      meta: {
        code: 200,
        message: "Success",
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateComment(
  req: Request<ParamsWithId, CommentDocument, ZComment>,
  res: Response<MessageResponse<CommentDocument | null>>,
  next: NextFunction
) {
  try {
    let comment = await Comment.findById(req.params.id);

    if (!comment)
      return res.json({
        data: comment,
        meta: {
          code: 404,
          message: "Not found",
        },
      });

    comment = await Comment.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    )
      .populate("user")
      .populate({
        path: "replies",
        populate: {
          path: "user",
        },
      });

    return res.json({
      data: comment,
      meta: {
        code: 200,
        message: "Success",
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function updateParentComment(id: string, commentId:string) {
  let comment = await Comment.findById(id);

  if (!comment) throw new Error("Comment parent not found");

  comment.replies?.find(reply => reply._id === commentId)
}

export async function deleteComment(
  req: Request<ParamsWithId, {}, {}>,
  res: Response<MessageResponse<null>>,
  next: NextFunction
) {
  try {
    let comment = await Comment.findByIdAndDelete(req.params.id);

    if (!comment)
      return res.json({
        data: comment,
        meta: {
          code: 404,
          message: "Not found",
        },
      });

      if(comment.parentId) updateParentComment(comment.parentId, comment._id)

    return res.json({
      data: null,
      meta: {
        code: 200,
        message: "Success",
      },
    });
  } catch (error) {
    return next(error);
  }
}
