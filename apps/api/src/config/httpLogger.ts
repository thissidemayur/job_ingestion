import pinoHttp from "pino-http";
import {logger} from "./logger"
import { Request, Response } from "express";
import { env } from "./env";

export const httpLogger = pinoHttp({
  logger,
  autoLogging: {
    ignore: (req) => req.url === "/favicon.ico",
  },

  redact: {
    paths: ["req.headers.authorization","req.headers.cookies"],
    remove:true
  },

  customSuccessMessage:()=> "Request completed",
  customErrorMessage:()=>"Request failed",

  customProps:(req)=>({
    service:env.SERVICE_NAME,
    requestId:req.id
  }),

  serializers: {
    req(req:Request) {
        return {
          method: req.method,
          url: req.url,
          ip: req.ip,
        };
    },

    res(res:Response) {
        return {
            statusCode: res.statusCode
        }
    }
  }

});