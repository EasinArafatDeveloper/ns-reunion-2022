import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  console.warn('WARNING: MONGODB_URI is not defined in environment variables. Please check your Vercel Project Settings or local .env.local.');
}

// Access the global object safely across hot reloads in Next.js development
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  // If the connection is already established, return it immediately
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection promise is not already in progress, create one
  if (!cached.promise) {
    if (!MONGODB_URI) {
      const errorMsg = 'CRITICAL: MONGODB_URI environment variable is missing or empty. Database connection aborted.';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    const opts = {
      bufferCommands: false,                  // Disable Mongoose command buffering (fail fast if connection is down)
      serverSelectionTimeoutMS: 5000,         // Time out after 5 seconds instead of 30 seconds if MongoDB is unreachable
      connectTimeoutMS: 5000,                 // Time out after 5 seconds on initial connection attempt
      socketTimeoutMS: 45000,                 // Close inactive sockets after 45 seconds to free up connections
    };

    console.log('Initiating cached MongoDB connection...');
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log('MongoDB successfully connected and cached.');
        return mongooseInstance;
      })
      .catch((error) => {
        console.error('Error establishing MongoDB connection:', error.message || error);
        cached.promise = null; // Clear cached promise on failure so subsequent requests can try again
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // Reset cached promise on throw
    console.error('Failed to resolve cached MongoDB connection promise:', error);
    throw error;
  }

  return cached.conn;
}

export default connectToDatabase;
