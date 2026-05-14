import { Router } from 'express';
import Plan from '../models/Plan.js';
import User from '../models/User.js';

const router = Router();

const fallbackCoordinates = {
  rambla: [-34.9137, -56.1608],
  'parque rodó': [-34.9108, -56.1709],
  'parque rodo': [-34.9108, -56.1709],
  'ciudad vieja': [-34.9067, -56.2035],
  cordón: [-34.9027, -56.1786],
  cordon: [-34.9027, -56.1786],
  pocitos: [-34.9101, -56.1469],
  'punta carretas': [-34.9227, -56.1594],
  montevideo: [-34.9011, -56.1645],
};

function resolveCoordinates({ lat, lng, city, ciudad, neighborhood, barrio, location }) {
  const parsedLat = Number(lat);
  const parsedLng = Number(lng);
  if (Number.isFinite(parsedLat) && Number.isFinite(parsedLng)) {
    return { lat: parsedLat, lng: parsedLng };
  }

  const searchable = `${location || ''} ${neighborhood || barrio || ''} ${city || ciudad || ''}`.toLowerCase();
  const match = Object.entries(fallbackCoordinates).find(([key]) => searchable.includes(key));
  const [fallbackLat, fallbackLng] = match?.[1] || fallbackCoordinates.montevideo;
  return { lat: fallbackLat, lng: fallbackLng };
}

function regex(value) {
  return new RegExp(`^${String(value)}$`, 'i');
}

function buildQuery(queryParams) {
  const { q, ciudad, city, categoria, category, compania, company, fecha, date, presupuesto, price } = queryParams;
  const query = {};

  if (ciudad || city) query.ciudad = regex(ciudad || city);
  if (categoria || category) query.categoria = regex(categoria || category);
  if (compania || company) query.compania = regex(compania || company);
  if (fecha || date) query.fecha = fecha || date;
  if (presupuesto || price) query.precio = regex(presupuesto || price);
  if (q) {
    query.$or = [
      { titulo: new RegExp(String(q), 'i') },
      { descripcion: new RegExp(String(q), 'i') },
      { barrio: new RegExp(String(q), 'i') },
      { categoria: new RegExp(String(q), 'i') },
      { tags: new RegExp(String(q), 'i') },
    ];
  }

  return query;
}

function usernameFromName(name = 'Usuario MOVA') {
  const base = String(name)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 18);
  return base ? `@${base}` : '@movauser';
}

async function ensureUserForAction(userId, payload = {}) {
  if (!userId) return null;
  const existing = await User.findById(userId);
  if (existing) return existing;

  const nombre = payload.userName || payload.name || payload.nombre || 'Usuario MOVA';
  const ciudad = payload.city || payload.ciudad || 'Montevideo';
  const baseUser = {
    _id: userId,
    nombre,
    username: payload.username || usernameFromName(nombre),
    ciudad,
    password: payload.password || '',
    savedExperiences: [],
    ...(payload.avatar ? { avatar: payload.avatar } : {}),
  };

  try {
    return await User.create({ ...baseUser, ...(payload.email ? { email: String(payload.email).toLowerCase() } : {}) });
  } catch (error) {
    if (payload.email && error?.code === 11000) {
      return User.create(baseUser);
    }
    throw error;
  }
}

router.get('/', async (req, res) => {
  try {
    const experiences = await Plan.find(buildQuery(req.query)).sort({ createdAt: -1, fecha: 1 });
    res.json(experiences);
  } catch {
    res.status(500).json({ error: 'No se pudieron cargar las experiencias.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      title,
      titulo,
      description,
      descripcion,
      city,
      ciudad,
      neighborhood,
      barrio,
      category,
      categoria,
      company,
      compania,
      date,
      fecha,
      time,
      horario,
      price,
      precio,
      image,
      imagen,
      images,
      tags,
      location,
      author,
      usuario,
      authorId,
      lat,
      lng,
    } = req.body;

    const gallery = Array.isArray(images) ? images.filter(Boolean) : String(images || '').split('\n').map((item) => item.trim()).filter(Boolean);
    const cover = image || imagen || gallery[0];
    const required = [title || titulo, description || descripcion, city || ciudad, neighborhood || barrio, category || categoria, company || compania, date || fecha, time || horario, cover];
    if (required.some((value) => !String(value || '').trim())) {
      return res.status(400).json({ error: 'Completá los campos obligatorios.' });
    }

    const coords = resolveCoordinates({ lat, lng, city, ciudad, neighborhood, barrio, location });

    const experience = await Plan.create({
      _id: `p_${Date.now()}`,
      titulo: title || titulo,
      descripcion: description || descripcion,
      ciudad: city || ciudad,
      barrio: neighborhood || barrio,
      categoria: category || categoria,
      compania: company || compania,
      fecha: date || fecha,
      horario: time || horario,
      precio: price || precio || '$',
      imagen: cover,
      images: gallery.length ? gallery : [cover],
      tags: Array.isArray(tags) ? tags : String(tags || category || categoria).split(',').map((item) => item.trim()).filter(Boolean),
      location: location || barrio || neighborhood,
      usuario: author || usuario || 'MOVA user',
      authorId,
      lat: coords.lat,
      lng: coords.lng,
      rating: 4.8,
      likes: 0,
      guardados: 0,
      comentarios: 0,
    });

    if (authorId) {
      await User.findByIdAndUpdate(authorId, { $inc: { puntos: 20 } });
    }

    res.status(201).json(experience);
  } catch {
    res.status(400).json({ error: 'No pudimos publicar la experiencia.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const experience = await Plan.findById(req.params.id);
    if (!experience) return res.status(404).json({ error: 'Experiencia no encontrada.' });
    return res.json(experience);
  } catch {
    return res.status(500).json({ error: 'No se pudo cargar la experiencia.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const {
      title,
      titulo,
      description,
      descripcion,
      city,
      ciudad,
      neighborhood,
      barrio,
      category,
      categoria,
      company,
      compania,
      date,
      fecha,
      time,
      horario,
      price,
      precio,
      image,
      imagen,
      images,
      tags,
      location,
      lat,
      lng,
    } = req.body;

    const update = {
      ...(title || titulo ? { titulo: title || titulo } : {}),
      ...(description || descripcion ? { descripcion: description || descripcion } : {}),
      ...(city || ciudad ? { ciudad: city || ciudad } : {}),
      ...(neighborhood || barrio ? { barrio: neighborhood || barrio } : {}),
      ...(category || categoria ? { categoria: category || categoria } : {}),
      ...(company || compania ? { compania: company || compania } : {}),
      ...(date || fecha ? { fecha: date || fecha } : {}),
      ...(time || horario ? { horario: time || horario } : {}),
      ...(price || precio ? { precio: price || precio } : {}),
      ...(image || imagen ? { imagen: image || imagen } : {}),
      ...(images ? { images: Array.isArray(images) ? images.filter(Boolean) : String(images).split('\n').map((item) => item.trim()).filter(Boolean) } : {}),
      ...(tags ? { tags: Array.isArray(tags) ? tags : String(tags).split(',').map((item) => item.trim()).filter(Boolean) } : {}),
      ...(location ? { location } : {}),
      ...(lat !== undefined ? { lat } : {}),
      ...(lng !== undefined ? { lng } : {}),
    };

    const experience = await Plan.findByIdAndUpdate(req.params.id, update, { returnDocument: 'after' });
    if (!experience) return res.status(404).json({ error: 'Experiencia no encontrada.' });
    return res.json(experience);
  } catch {
    return res.status(400).json({ error: 'No pudimos actualizar la experiencia.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const experience = await Plan.findByIdAndDelete(req.params.id);
    if (!experience) return res.status(404).json({ error: 'Experiencia no encontrada.' });
    await User.updateMany({ savedExperiences: req.params.id }, { $pull: { savedExperiences: req.params.id } });
    return res.json({ message: 'Experiencia eliminada correctamente.' });
  } catch {
    return res.status(400).json({ error: 'No pudimos eliminar la experiencia.' });
  }
});

router.post('/:id/comment', async (req, res) => {
  try {
    const { userId, userName, text, rating, photos, avatar } = req.body;
    if (!String(text || '').trim()) return res.status(400).json({ error: 'Escribí un comentario.' });

    const parsedRating = Math.max(1, Math.min(5, Number(rating) || 5));
    const comment = {
      id: `c_${Date.now()}`,
      userId,
      userName: userName || 'Usuario MOVA',
      text: text.trim(),
      rating: parsedRating,
      photos: Array.isArray(photos) ? photos.filter(Boolean).slice(0, 3) : [],
      avatar,
      createdAt: new Date(),
    };

    const current = await Plan.findById(req.params.id);
    if (!current) return res.status(404).json({ error: 'Experiencia no encontrada.' });
    const existingRatings = (current.comments || []).map((item) => Number(item.rating)).filter(Boolean);
    const nextRating = [...existingRatings, parsedRating].reduce((sum, value) => sum + value, 0) / (existingRatings.length + 1);

    const experience = await Plan.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: comment }, $inc: { comentarios: 1 }, $set: { rating: Number(nextRating.toFixed(1)) } },
      { returnDocument: 'after' }
    );

    if (userId) await User.findByIdAndUpdate(userId, { $inc: { puntos: 10 } });

    return res.json(experience);
  } catch {
    return res.status(400).json({ error: 'No pudimos guardar el comentario.' });
  }
});

router.post('/:id/save', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'Iniciá sesión para guardar experiencias.' });

    const experience = await Plan.findById(req.params.id);
    if (!experience) return res.status(404).json({ error: 'No encontramos ese plan.' });

    const user = await ensureUserForAction(userId, req.body);
    if (!user) return res.status(400).json({ error: 'Iniciá sesión para guardar experiencias.' });

    const saved = user.savedExperiences?.includes(req.params.id);
    const userUpdate = saved
      ? { $pull: { savedExperiences: req.params.id } }
      : { $addToSet: { savedExperiences: req.params.id } };
    const planUpdate = saved
      ? { $pull: { savedBy: userId }, $inc: { guardados: -1 } }
      : { $addToSet: { savedBy: userId }, $inc: { guardados: 1 } };

    await User.findByIdAndUpdate(userId, userUpdate);
    const updated = await Plan.findByIdAndUpdate(req.params.id, planUpdate, { returnDocument: 'after' });

    return res.json({ saved: !saved, experience: updated, message: saved ? 'Experiencia eliminada de guardados.' : 'Experiencia guardada.' });
  } catch {
    return res.status(400).json({ error: 'No pudimos actualizar guardados.' });
  }
});

router.post('/:id/join', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'Iniciá sesión para sumarte a un plan.' });

    const experience = await Plan.findById(req.params.id);
    if (!experience) return res.status(404).json({ error: 'No encontramos ese plan.' });

    const user = await ensureUserForAction(userId, req.body);
    if (!user) return res.status(400).json({ error: 'Iniciá sesión para sumarte a un plan.' });

    const joined = experience.joinedUsers?.includes(userId);
    const update = joined
      ? { $pull: { joinedUsers: userId } }
      : { $addToSet: { joinedUsers: userId } };

    const updated = await Plan.findByIdAndUpdate(req.params.id, update, { returnDocument: 'after' });
    return res.json({
      joined: !joined,
      experience: updated,
      message: joined ? 'Ya no estás sumada al plan.' : 'Te sumaste al plan.',
    });
  } catch {
    return res.status(400).json({ error: 'No pudimos actualizar tu participación.' });
  }
});

router.post('/:id/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const experience = await Plan.findById(req.params.id);
    if (!experience) return res.status(404).json({ error: 'Experiencia no encontrada.' });

    const liked = userId && experience.likedBy?.includes(userId);
    const update = liked
      ? { $pull: { likedBy: userId }, $inc: { likes: -1 } }
      : { $addToSet: { likedBy: userId || `anon_${Date.now()}` }, $inc: { likes: 1 } };

    const updated = await Plan.findByIdAndUpdate(req.params.id, update, { returnDocument: 'after' });
    return res.json(updated);
  } catch {
    return res.status(400).json({ error: 'No pudimos actualizar el like.' });
  }
});

export default router;
