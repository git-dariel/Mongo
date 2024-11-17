import dotenv from "dotenv";
import { createApp } from "./config/app";
import { connectDatabase } from "./config/database";
import { config } from "./config/constants";
import "reflect-metadata";

dotenv.config();

// Purpose: Start the server
const startServer = async () => {
  try {
    await connectDatabase();

    const app = createApp();
    const port = process.env.PORT || config.PORT;

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
