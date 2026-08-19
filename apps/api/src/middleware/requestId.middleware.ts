import { NextFunction, Request, Response } from "express";
import { randomUUID } from "node:crypto";

export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const requestId = req.header("X-Request-Id")?.trim() || randomUUID();

  req.id = requestId;

  res.setHeader("X-Request-Id", requestId);
  next();
};
