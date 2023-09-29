import { NextFunction, Request, Response } from "express";
import ErrorResponse from "./interface/ErrorResponse";
import RequestValidators from "./interface/RequestValidator";

export function validateRequest(validators: RequestValidators) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (validators.params)
        req.params = await validators.params.parseAsync(req.params);

      if (validators.body)
        req.body = await validators.body.parseAsync(req.body);

      if (validators.query)
        req.query = await validators.query.parseAsync(req.query);

      next();
    } catch (error) {
      next(error);
    }
  };
}

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(400);

  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);

  next(error);
}

export function errorHandler(
  error: Error,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode);

  res.json({
    meta: {
      code: statusCode,
      message: error.message,
    },
    stack: process.env.NODE_ENV === "production" ? "🍺" : error.stack,
  });
}
