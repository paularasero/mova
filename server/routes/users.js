import { Router } from 'express';
import User from '../models/User.js';
import Plan from '../models/Plan.js';

const router = Router();

function createUsername(name) {
  return (
    name
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '') || `usuario${Date.now().toString().slice(-4)}`
  );
}

function isValidEmail(email = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sendValidationError(res, status, message) {
  return res.status(status).json({ message, error: message });
}

function validatePassword(password = '') {
  if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
  if (!/[A-ZÁÉÍÓÚÑ]/.test(password)) return 'La contraseña debe incluir una mayúscula.';
  if (!/[a-záéíóúñ]/.test(password)) return 'La contraseña debe incluir una minúscula.';
  if (!/\d/.test(password)) return 'La contraseña debe incluir un número.';
  return '';
}

router.get('/', async (_req, res) => {
  try {
    const users = await User.find().sort({ puntos: -1, nombre: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'No pudimos obtener los usuarios.' });
  }
});

router.get('/search', async (req, res) => {
  try {
    const query = String(req.query.q || '').trim();
    const filter = query
      ? { $or: [{ nombre: new RegExp(query, 'i') }, { username: new RegExp(query, 'i') }, { ciudad: new RegExp(query, 'i') }] }
      : {};
    const users = await User.find(filter).sort({ puntos: -1, nombre: 1 }).limit(24);
    res.json(users);
  } catch {
    res.status(500).json({ error: 'No pudimos buscar usuarios.' });
  }
});

router.get('/me/profile', async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: 'Falta identificar el usuario.' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });

    const [created, saved] = await Promise.all([
      Plan.find({ authorId: userId }).sort({ createdAt: -1 }),
      Plan.find({ _id: { $in: user.savedExperiences || [] } }).sort({ createdAt: -1 }),
    ]);

    const receivedSaves = created.reduce((sum, plan) => sum + (plan.guardados || 0), 0);
    const commentCount = created.reduce((sum, plan) => sum + (plan.comentarios || 0), 0);
    const points = created.length * 20 + commentCount * 10 + receivedSaves * 5;

    const normalized = user.toJSON();
    res.json({
      user: { ...normalized, puntos: Math.max(user.puntos || 0, points) },
      created,
      saved,
      stats: {
        created: created.length,
        saved: saved.length,
        points,
        followers: normalized.followersCount,
        following: normalized.followingCount,
      },
    });
  } catch {
    res.status(500).json({ error: 'No pudimos cargar tu perfil.' });
  }
});

router.get('/me/saved', async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: 'Falta identificar el usuario.' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });
    const saved = await Plan.find({ _id: { $in: user.savedExperiences || [] } }).sort({ createdAt: -1 });
    res.json(saved);
  } catch {
    res.status(500).json({ error: 'No pudimos cargar tus guardadas.' });
  }
});

router.get('/me/experiences', async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: 'Falta identificar el usuario.' });
    const experiences = await Plan.find({ authorId: userId }).sort({ createdAt: -1 });
    res.json(experiences);
  } catch {
    res.status(500).json({ error: 'No pudimos cargar tus experiencias.' });
  }
});

router.put('/me', async (req, res) => {
  try {
    const { userId, name, nombre, city, ciudad, avatar, preferences } = req.body;
    if (!userId) return res.status(400).json({ error: 'Falta identificar el usuario.' });

    const update = {
      ...(name || nombre ? { nombre: name || nombre } : {}),
      ...(city || ciudad ? { ciudad: city || ciudad } : {}),
      ...(avatar ? { avatar } : {}),
      ...(preferences ? { preferences } : {}),
    };

    const user = await User.findByIdAndUpdate(userId, update, { returnDocument: 'after' });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });
    return res.json(user);
  } catch {
    return res.status(400).json({ error: 'No pudimos actualizar tu perfil.' });
  }
});

router.post('/:id/follow', async (req, res) => {
  try {
    const targetId = req.params.id;
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ error: 'Falta identificar el usuario.' });
    if (userId === targetId) return res.status(400).json({ error: 'No podés seguirte a vos misma.' });

    const [currentUser, targetUser] = await Promise.all([
      User.findById(userId),
      User.findById(targetId),
    ]);

    if (!currentUser || !targetUser) return res.status(404).json({ error: 'Usuario no encontrado.' });

    const isFollowing = currentUser.following?.includes(targetId);
    if (isFollowing) {
      currentUser.following = (currentUser.following || []).filter((id) => id !== targetId);
      targetUser.followers = (targetUser.followers || []).filter((id) => id !== userId);
      currentUser.siguiendo = Math.max((currentUser.siguiendo || 1) - 1, currentUser.following.length);
      targetUser.seguidores = Math.max((targetUser.seguidores || 1) - 1, targetUser.followers.length);
    } else {
      currentUser.following = [...new Set([...(currentUser.following || []), targetId])];
      targetUser.followers = [...new Set([...(targetUser.followers || []), userId])];
      currentUser.siguiendo = Math.max((currentUser.siguiendo || 0) + 1, currentUser.following.length);
      targetUser.seguidores = Math.max((targetUser.seguidores || 0) + 1, targetUser.followers.length);
    }

    await Promise.all([currentUser.save(), targetUser.save()]);

    res.json({
      following: !isFollowing,
      message: isFollowing ? 'Dejaste de seguir a este usuario.' : 'Ahora seguís a este usuario.',
      user: currentUser,
      target: targetUser,
    });
  } catch {
    res.status(500).json({ error: 'No pudimos actualizar el seguimiento.' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, nombre, email, city, ciudad, password } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!name && !nombre) return sendValidationError(res, 400, 'Ingresá tu nombre.');
    if (!normalizedEmail) return sendValidationError(res, 400, 'Ingresá tu email.');
    if (!isValidEmail(normalizedEmail)) return sendValidationError(res, 400, 'Ingresá un email válido.');
    const passwordError = validatePassword(password);
    if (passwordError) return sendValidationError(res, 400, passwordError);

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) return sendValidationError(res, 409, 'El email ya está registrado.');

    const displayName = String(name || nombre).trim();
    const user = await User.create({
      _id: `u_${Date.now()}`,
      nombre: displayName,
      username: createUsername(displayName),
      email: normalizedEmail,
      password,
      ciudad: city || ciudad || 'Montevideo',
      puntos: 0,
      seguidores: 0,
      siguiendo: 0,
      avatar: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${encodeURIComponent(displayName)}&backgroundColor=fd7407,f9a809,fb97b3,0869d0,04533e`,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: 'No pudimos crear la cuenta.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const normalizedEmail = String(req.body.email || '').trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail, password: req.body.password });

    if (!user) return res.status(401).json({ error: 'Email o contraseña incorrectos.' });

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: 'No pudimos iniciar sesión.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: 'No pudimos obtener el usuario.' });
  }
});

export default router;
