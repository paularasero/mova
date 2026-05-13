import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    text: { type: String, required: true },
    time: { type: String, default: 'Ahora' },
  },
  { _id: false }
);

const conversationSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    avatar: { type: String, required: true },
    vibe: { type: String, default: 'planes' },
    preview: { type: String, required: true },
    time: { type: String, default: 'Ahora' },
    unread: { type: Number, default: 0 },
    messages: [messageSchema],
  },
  {
    versionKey: false,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

export default mongoose.model('Conversation', conversationSchema);
