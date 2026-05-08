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
    rating: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    guardados: { type: Number, default: 0 },
    usuario: { type: String, required: true, trim: true },
    puntosGenera: { type: Number, default: 20 },
    comentarios: { type: Number, default: 0 },
  },
  {
    versionKey: false,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        ret.image = ret.imagen;
        delete ret._id;
      },
    },
  }
);

export default mongoose.model('Plan', planSchema);
