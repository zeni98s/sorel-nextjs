import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URL || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'sorel_production';

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export async function getDatabase() {
  const client = await clientPromise;
  return client.db(dbName);
}

export async function getCollection(collectionName) {
  const db = await getDatabase();
  return db.collection(collectionName);
}
