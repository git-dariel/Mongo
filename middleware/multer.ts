import multer from "multer";
import { Request } from "express";
import { AppError } from "./errorHandler";

const storage = multer.memoryStorage();

const fileFilter = (_req: Request, file: Express.Multer.File, cb: Function) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1 * 1024 * 1024, // 1MB limit
  },
});
