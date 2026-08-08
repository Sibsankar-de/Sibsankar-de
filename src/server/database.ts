import "server-only";
import mongoose from "mongoose";

const mongoUri = process.env.MONGODB_URI;

type MongooseCache = { connection: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

const globalForMongoose = globalThis as typeof globalThis & { mongoose: MongooseCache };
const cache = globalForMongoose.mongoose ?? { connection: null, promise: null };
globalForMongoose.mongoose = cache;

export async function connectDatabase() {
  if (!mongoUri) throw new Error("MONGODB_URI is not configured.");
  if (cache.connection) return cache.connection;
  cache.promise ??= mongoose.connect(mongoUri, { bufferCommands: false });
  cache.connection = await cache.promise;
  return cache.connection;
}
