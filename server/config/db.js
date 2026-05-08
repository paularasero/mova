import mongoose from 'mongoose';
import { seedDatabase } from './seed.js';

export async function connectDB() {
  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }

    if (!process.env.MONGODB_URI) {
      throw new Error('Falta definir MONGODB_URI en .env');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB conectado');
    await seedDatabase();
  } catch (error) {
    console.error('Error conectando MongoDB:', error.message);
    throw error;
  }
}
