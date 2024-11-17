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

let cached: MongooseConnection = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

export const connectDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) throw new Error(config.DB.MISSING);

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URI, {
      dbName: "test",
      bufferCommands: false,
    });

  cached.conn = await cached.promise;
  logger.info("Connected to database");
  return cached.conn;
};
