import plans from '../data/plans.json' with { type: 'json' };
import users from '../data/users.json' with { type: 'json' };
import Plan from '../models/Plan.js';
import User from '../models/User.js';

export async function seedDatabase() {
  const [planCount, userCount] = await Promise.all([Plan.countDocuments(), User.countDocuments()]);

  await Promise.all(
    plans.map(({ id, ...plan }) =>
      Plan.findByIdAndUpdate(id, { _id: id, ...plan }, { upsert: true, returnDocument: 'after' })
    )
  );
  if (planCount === 0) console.log('Planes iniciales cargados en MongoDB');

  if (userCount === 0) {
    await User.insertMany(users.map(({ id, ...user }) => ({ _id: id, ...user })));
    console.log('Usuarios iniciales cargados en MongoDB');
  }
}
