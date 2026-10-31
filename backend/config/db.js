import mongoose from 'mongoose';

let isConnected = false;
let memoryStore = []; // In-memory fallback if MongoDB is not accessible

export const connectDB = async () => {
  const uri = process.env.ATLAS_URL || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skin_ai_detect';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to database.`);
  } catch (error) {
    isConnected = false;
    console.warn(`[MongoDB Warning] Could not connect to MongoDB at ${uri}.`);
    console.warn(`[MongoDB Notice] Operating with in-memory fallback store so your app works seamlessly! You can configure MONGO_URI in .env anytime.`);
  }
};

export const getDBStatus = () => ({
  connected: isConnected,
  type: isConnected ? 'MongoDB (Mongoose)' : 'In-Memory Fallback Store',
  recordCount: isConnected ? null : memoryStore.length
});

export const getMemoryStore = () => memoryStore;
