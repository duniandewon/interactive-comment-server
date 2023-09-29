import { NextFunction, Request, Response } from "express";
import User, { ZUser, UserDocument } from "./user.model";
import MessageResponse from "src/interface/MessageResponse";
import { InsertManyResult } from "mongoose";

const _users: ZUser[] = [
  {
    username: "amyrobson",
  },
  {
    username: "juliusomo",
  },
  {
    username: "maxblagun",
  },
  {
    username: "ramsesmiron",
  },
];

export async function getUsers(
  req: Request<{}, {}, {}, { search?: string }>,
  res: Response<MessageResponse<UserDocument[]>>,
  next: NextFunction
) {
  try {
    const users = await User.find({
      username: { $regex: req.query.search || "", $options: "i" },
    });

    res.json({
      data: users,
      meta: {
        code: 200,
        message: "success",
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function registerUser(
  req: Request,
  res: Response<
    MessageResponse<InsertManyResult<UserDocument> | UserDocument[]>
  >,
  next: NextFunction
) {
  try {
    const users = await User.find();

    if (users.length)
      return res.json({
        data: users,
        meta: {
          code: 200,
          message: "success",
        },
      });

    const newUsers = await User.insertMany(_users);

    res.json({
      data: newUsers,
      meta: {
        code: 200,
        message: "success",
      },
    });
  } catch (error) {
    next(error);
  }
}
