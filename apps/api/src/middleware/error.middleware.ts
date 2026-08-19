import { Request, Response ,NextFunction} from "express";
import { AppError } from "../errors/AppError";
import { logger } from "../config/logger";

export const errorMiddleware = (err:Error,_req:Request,res:Response,_next:NextFunction) =>{
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success:false,
            message: err.message
        })
    } 

    logger.error({
        err:err,
    },"unhandled application error")
    

    return res.status(500).json({
        success:false,
        message: "Internal server Error"
    })
}