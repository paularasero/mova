import plans from '../data/plans.json' with { type: 'json' };
import users from '../data/users.json' with { type: 'json' };
import Plan from '../models/Plan.js';
import User from '../models/User.js';

export async function seedDatabase() {
  const [planCount, userCount] = await Promise.all([Plan.countDocuments(), User.countDocuments()]);

  if (planCount === 0) {
    await Plan.insertMany(plans.map(({ id, ...plan }) => ({ _id: id, ...plan })));
    console.log('Planes iniciales cargados en MongoDB');
  }

  if (userCount === 0) {
    await User.insertMany(users.map(({ id, ...user }) => ({ _id: id, ...user })));
    console.log('Usuarios iniciales cargados en MongoDB');
  }
}
