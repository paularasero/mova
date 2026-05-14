import mongoose from 'mongoose';
import { seedDatabase } from './seed.js';

export async function connectDB() {
  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }

    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('Falta definir MONGODB_URI o MONGO_URI en .env');
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB conectado');
    await seedDatabase();
  } catch (error) {
    console.error('Error conectando MongoDB:', error.message);
    throw error;
  }
}
