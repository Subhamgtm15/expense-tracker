const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

let db;

async function connectDB() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB!');
    db = client.db('finance-tracker');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  }
}

function getDB() {
  if (!db) {
    throw new Error('Database not connected!');
  }
  return db;
}

module.exports = { connectDB, getDB };