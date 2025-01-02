import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler, notFound } from "../middleware/errorHandler";
import { routes } from "../routes";
import { createController } from "express-extract-routes";
import { setupSwagger } from "./swagger";

// Create an express application
export const createApp = (): express.Application => {
  const app = express();

  // Middleware
  app.use(helmet());
  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  //Routes
  routes.forEach((route) => {
    app[route.method](
      //you can add prefix
      `/api${route.path}`,
      //add here the middlewares
      createController(route) // generating routing
    );
  });

  // Swagger setup
  setupSwagger(app);

  // Error handler
  app.use(notFound);
  app.use(errorHandler);

  return app;
};
