import { Request, Response, NextFunction } from "express";
import { logger } from "../helpers/logger";
import mongoose from "mongoose";

// Check if error is a MongoDB server error
const isMongoServerError = (err: any): boolean => {
  return err.name === "MongoServerError" || 
         err.constructor?.name === "MongoServerError" ||
         (err.message && typeof err.message === "string" && err.message.includes("MongoServerError"));
};

// Purpose: Custom error handler middleware
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

const handleMongooseError = (err: any): AppError => {
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((e: any) => e.message);
    return new AppError(messages.join(", "), 400);
  }
  if (err instanceof mongoose.Error.CastError) {
    return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return new AppError(`${field} already exists`, 400);
  }
  // Handle MongoDB server errors (like projection errors)
  if (isMongoServerError(err)) {
    return new AppError(err.message || "Database operation failed", 400);
  }
  return new AppError("Database error", 500, false);
};

// Helper: Log error with context
const logError = (err: Error, req: Request): void => {
  const logData = {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  };
  err instanceof AppError && err.isOperational
    ? logger.warn(logData)
    : logger.error(logData);
};

// Not found route handler
export const notFound = (_req: Request, _res: Response, next: NextFunction): void => {
  const error = new AppError("Not found", 404);
  next(error);
};

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction): void => {
  logError(err, req);

  let error = err instanceof AppError ? err : handleMongooseError(err);
  
  // Only mask non-operational errors in production
  if (!error.isOperational && process.env.NODE_ENV === "production") {
    error = new AppError("Internal server error", 500);
  }

  res.status(error.statusCode).json({
    status: "error",
    message: error.message,
    ...(process.env.NODE_ENV !== "production" && { stack: error.stack }),
  });
};