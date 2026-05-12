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
    followers: [{ type: String }],
    following: [{ type: String }],
    savedExperiences: [{ type: String }],
    preferences: {
      favoriteCategories: [{ type: String }],
      company: [{ type: String }],
      birthday: { type: String },
      setupComplete: { type: Boolean, default: false },
      theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    },
    avatar: {
      type: String,
      default: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=MovaLime&backgroundColor=c8ff3d',
    },
  },
  {
    versionKey: false,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        ret.name = ret.nombre;
        ret.city = ret.ciudad;
        ret.followersCount = ret.followers?.length || ret.seguidores || 0;
        ret.followingCount = ret.following?.length || ret.siguiendo || 0;
        ret.setupComplete = Boolean(ret.preferences?.setupComplete);
        delete ret._id;
        delete ret.password;
      },
    },
  }
);

export default mongoose.model('User', userSchema);
