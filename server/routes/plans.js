import { Router } from 'express';
import Plan from '../models/Plan.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { ciudad, categoria, compania } = req.query;
    const query = {};

    if (ciudad) query.ciudad = new RegExp(`^${String(ciudad)}$`, 'i');
    if (categoria) query.categoria = new RegExp(`^${String(categoria)}$`, 'i');
    if (compania) query.compania = new RegExp(`^${String(compania)}$`, 'i');

    const plans = await Plan.find(query).sort({ fecha: 1, horario: 1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: 'No pudimos obtener los planes.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const plan = await Plan.create({
      _id: `p_${Date.now()}`,
      ...req.body,
      imagen: req.body.imagen || req.body.image,
    });

    res.status(201).json(plan);
  } catch (error) {
    res.status(400).json({ error: 'No pudimos crear el plan.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan no encontrado' });
    return res.json(plan);
  } catch (error) {
    return res.status(500).json({ error: 'No pudimos obtener el plan.' });
  }
});

export default router;
