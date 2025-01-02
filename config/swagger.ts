import { Application } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { SwaggerTheme, SwaggerThemeNameEnum } from "swagger-themes";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MONGO API",
      version: "1.0.0",
      description: "A robust and scalable MONGO API using Express.js and TypeScript",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
      },
    ],
  },
  // Path to the API docs
  apis: ["./controllers/*.ts", "./routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);
const theme = new SwaggerTheme();

export const setupSwagger = (app: Application) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
    })
  );
};
