import { Response } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";


export class ApiResponse {
  static success<T>(res: Response, data: T, message: "Success") {
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message,
      data,
    });
  }

  static created<T>(
    res: Response,
    data: T,
    message: "Resource created successfully",
  ) {
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message,
      data,
    });
  }

  static noContent<T>(
    res: Response,
    data: T,
    message: "Resource created successfully",
  ) {
    return res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}

