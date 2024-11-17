import mongoose, { Mongoose } from "mongoose";
import { logger } from "../helpers/logger";
import { config } from "./constants";

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * Caches the connection to avoid multiple connections.
 * Throws an error if the MongoDB URI is not provided.
 */
const MONGODB_URI = process.env.MONGO_URI || config.DB.URI;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

const cached: MongooseConnection = {
  conn: null,
  promise: null,
};

if (!cached.conn || !cached.promise) {
  cached.conn = null;
  cached.promise = mongoose
    .connect(MONGODB_URI)
    .then((mongoose: Mongoose) => {
      logger.info(config.DB.CONNECTED);
      return mongoose;
    })
    .catch((error: Error) => {
      logger.error(config.DB.ERROR, error);
      throw error;
    });
}

export const connectDatabase = async () => {
  if (!cached.promise) {
    throw new Error(config.DB.NOT_INITIALIZED);
  }

  if (!cached.conn) {
    await cached.promise;
  }

  return mongoose.connection;
};
