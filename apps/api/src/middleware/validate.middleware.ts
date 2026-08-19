import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AnyZodObject } from "zod/v3";
import { AppError } from "../errors/AppError";

export const validate = (schema:AnyZodObject) => (req:Request,_res:Response,next:NextFunction) => {
    try {
        schema.parse({
          body: req.body,
          params: req.params,
          query:req.query
        });

        next()
    } catch (error) {
        if (error instanceof ZodError) {
            return next(
              new AppError(
                error.issues.map((issue) => issue.message).join(", "),
                400
              )
            );
        }

        next(error)
    }
}