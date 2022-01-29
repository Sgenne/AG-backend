import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const db = new MongoMemoryServer();

export const connect = async () => {
  await db.start();
  let uri;
  try {
    uri = db.getUri();
  } catch (error) {
    return;
  }

  if (!uri) {
    throw new Error("uri not set.");
  }

  await mongoose.connect(uri);
};

export const close = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await db.stop();
};

export const clear = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};
