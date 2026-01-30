import dotenv from "dotenv";
import { createApp } from "./config/app";
import { connectDatabase } from "./config/database";
import { config } from "./config/constants";
import { logger } from "./helpers/logger";
import "reflect-metadata";

dotenv.config();

// Purpose: Start the server
const startServer = async () => {
  try {
    await connectDatabase();

    const app = createApp();
    const port = process.env.PORT || config.PORT;

    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  } catch (error) {
    logger.error("Failed to start server", {error});
    process.exit(1);
  }
};

startServer();
