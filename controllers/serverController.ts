import { Request, Response, NextFunction } from "express";
import { config } from "../config/constants";
import { route } from "express-extract-routes";

// Purpose: This controller class is responsible for handling the server related requests.
export class ServerController {
  @route.get("/")
  getServer = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json({ message: config.MESSAGE.WELCOME });
    } catch (error) {
      next(error);
    }
  };
}
