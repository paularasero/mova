import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    nombre: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, unique: true, sparse: true },
    password: { type: String },
    ciudad: { type: String, required: true, trim: true },
    puntos: { type: Number, default: 0 },
    seguidores: { type: Number, default: 0 },
    siguiendo: { type: Number, default: 0 },
    savedExperiences: [{ type: String }],
    preferences: {
      favoriteCategories: [{ type: String }],
      company: [{ type: String }],
      birthday: { type: String },
      setupComplete: { type: Boolean, default: false },
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1542204625-de293a2f7f7b?auto=format&fit=crop&w=300&q=80',
    },
  },
  {
    versionKey: false,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        ret.name = ret.nombre;
        ret.city = ret.ciudad;
        ret.setupComplete = Boolean(ret.preferences?.setupComplete);
        delete ret._id;
        delete ret.password;
      },
    },
  }
);

export default mongoose.model('User', userSchema);
