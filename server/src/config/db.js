const mongoose = require('mongoose');
const autoSeed = require('../utils/autoSeed');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    await autoSeed();
    return conn;
  } catch (error) {
    console.warn(`⚠️ Primary MongoDB Connection failed (${error.message}). Attempting in-memory MongoDB fallback...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create({
        instance: { dbName: 'munnalal_painter' },
        spawnTimeoutMS: 60000,
      });
      const uri = mongod.getUri();
      process.env.MONGODB_URI = uri;
      const conn = await mongoose.connect(uri);
      console.log(`✅ In-Memory MongoDB Connected: ${conn.connection.host}`);
      await autoSeed();
      return conn;
    } catch (memError) {
      console.error(`❌ MongoDB Connection Error: ${memError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;

