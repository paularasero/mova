import plans from '../data/plans.json' with { type: 'json' };
import users from '../data/users.json' with { type: 'json' };
import conversations from '../data/conversations.json' with { type: 'json' };
import Conversation from '../models/Conversation.js';
import Plan from '../models/Plan.js';
import User from '../models/User.js';

const demoComments = [
  {
    id: 'demo_review_1',
    userId: 'u2',
    userName: 'Martina',
    text: 'Estuvo increíble el sunset. Fuimos 5 amigas y el ambiente fue re tranqui.',
    rating: 5,
    photos: ['https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?auto=format&fit=crop&w=500&q=80'],
    avatar: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=ReviewMartina&backgroundColor=ff74c8',
    createdAt: new Date('2026-05-01T21:00:00.000Z'),
  },
  {
    id: 'demo_review_2',
    userId: 'u3',
    userName: 'Juan',
    text: 'Muy buena música, gente abierta y fácil para caer sin conocer a nadie.',
    rating: 4,
    photos: ['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=500&q=80'],
    avatar: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=ReviewJuan&backgroundColor=67c8ff',
    createdAt: new Date('2026-05-03T22:00:00.000Z'),
  },
  {
    id: 'demo_review_3',
    userId: 'u4',
    userName: 'Sofía',
    text: 'Lleven abrigo y cámara con flash. El plan rinde mucho más de noche.',
    rating: 5,
    photos: ['https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=500&q=80'],
    avatar: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=ReviewSofia&backgroundColor=ffd84d',
    createdAt: new Date('2026-05-05T19:30:00.000Z'),
  },
];

export async function seedDatabase() {
  const [planCount, userCount, conversationCount] = await Promise.all([Plan.countDocuments(), User.countDocuments(), Conversation.countDocuments()]);

  await Promise.all(
    plans.map(({ id, ...plan }) =>
      Plan.findByIdAndUpdate(id, { _id: id, ...plan }, { upsert: true, returnDocument: 'after' })
    )
  );
  if (planCount === 0) console.log('Planes iniciales cargados en MongoDB');

  await Plan.updateMany(
    { $or: [{ comments: { $exists: false } }, { comments: { $size: 0 } }] },
    { $set: { comments: demoComments, comentarios: demoComments.length } }
  );

  if (userCount === 0) {
    await User.insertMany(users.map(({ id, ...user }) => ({ _id: id, ...user })));
    console.log('Usuarios iniciales cargados en MongoDB');
  }

  if (conversationCount === 0) {
    await Conversation.insertMany(conversations.map(({ id, ...conversation }) => ({ _id: id, ...conversation })));
    console.log('Conversaciones demo cargadas en MongoDB');
  }
}
