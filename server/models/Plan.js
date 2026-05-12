import mongoose from 'mongoose';

const planSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    titulo: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true, trim: true },
    ciudad: { type: String, required: true, trim: true },
    barrio: { type: String, required: true, trim: true },
    categoria: { type: String, required: true, trim: true },
    compania: { type: String, required: true, trim: true },
    fecha: { type: String, required: true },
    horario: { type: String, required: true },
    precio: { type: String, required: true },
    imagen: { type: String, required: true },
    images: [{ type: String }],
    tags: [{ type: String }],
    location: { type: String },
    rating: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    guardados: { type: Number, default: 0 },
    usuario: { type: String, required: true, trim: true },
    authorId: { type: String },
    puntosGenera: { type: Number, default: 20 },
    comentarios: { type: Number, default: 0 },
    comments: [
      {
        id: { type: String, required: true },
        userId: { type: String },
        userName: { type: String, required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    savedBy: [{ type: String }],
    likedBy: [{ type: String }],
    joinedUsers: [{ type: String }],
    lat: { type: Number },
    lng: { type: Number },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        ret.image = ret.imagen;
        ret.images = ret.images?.length ? ret.images : [ret.imagen].filter(Boolean);
        ret.title = ret.titulo;
        ret.description = ret.descripcion;
        ret.city = ret.ciudad;
        ret.neighborhood = ret.barrio;
        ret.category = ret.categoria;
        ret.company = ret.compania;
        ret.date = ret.fecha;
        ret.time = ret.horario;
        ret.price = ret.precio;
        ret.location = ret.location || ret.barrio;
        ret.author = ret.usuario;
        ret.saves = ret.guardados;
        ret.joinedUsers = ret.joinedUsers || [];
        ret.interestedCount = (ret.guardados || 0) + ret.joinedUsers.length;
        ret.commentCount = ret.comentarios;
        delete ret._id;
      },
    },
  }
);

export default mongoose.model('Plan', planSchema);
