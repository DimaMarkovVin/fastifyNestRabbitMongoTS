import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

export const getCollection = async (collectionName) => {
  const client = await MongoClient.connect(
    `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@localhost:27017`,
  );

  return client.db(process.env.MONGO_DATABASE).collection(collectionName);
};
