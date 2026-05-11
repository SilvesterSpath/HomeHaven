import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  mongoose.set('strictQuery', true);

  // 1 = connected in Mongoose readyState
  if (cached.conn && mongoose.connection.readyState === 1) {
    console.log('MongoDB is already connected...');
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI);
  }

  try {
    cached.conn = await cached.promise;
    console.log('MongoDB connected...');
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
};

export default connectDB;
