import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);

  // Sequelize validation errors
  if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: err.message,
    });
  }

  // Sequelize foreign key constraint
  if (err.name === "SequelizeForeignKeyConstraintError") {
    return res.status(400).json({
      success: false,
      message: "Invalid reference",
      error: "The provided user does not exist",
    });
  }

  // Sequelize database connection errors
  if (err.name === "SequelizeConnectionError") {
    return res.status(503).json({
      success: false,
      message: "Database connection error. Please try again later.",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }

  // Custom application errors
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Default server error
  res.status(500).json({
    success: false,
    message: "Internal server error",
    ...(process.env.NODE_ENV === "development" && { error: err.message }),
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const createError = (statusCode: number, message: string): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  return error;
};

