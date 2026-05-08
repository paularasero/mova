import { Router } from 'express';
import User from '../models/User.js';

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

router.get('/', async (_req, res) => {
  try {
    const users = await User.find().sort({ puntos: -1, nombre: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'No pudimos obtener los usuarios.' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, nombre, email, city, ciudad, password } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!name && !nombre) return res.status(400).json({ error: 'Ingresá tu nombre.' });
    if (!normalizedEmail) return res.status(400).json({ error: 'Ingresá tu email.' });
    if (!password || password.length < 6) return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) return res.status(409).json({ error: 'Ya existe una cuenta con ese email.' });

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
