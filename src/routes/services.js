const express = require('express');
const prisma = require('../lib/prisma');

const router = express.Router();

// GET /api/services — Fetch all services
router.get('/', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      include: {
        _count: { select: { projects: true } },
      },
      orderBy: { title: 'asc' },
    });

    res.json({ success: true, data: services });
  } catch (error) {
    console.error('Services fetch error:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des services' });
  }
});

// GET /api/services/:id — Fetch single service
router.get('/:id', async (req, res) => {
  try {
    const service = await prisma.service.findUnique({
      where: { id: req.params.id },
      include: { projects: true },
    });

    if (!service) {
      return res.status(404).json({ success: false, error: 'Service non trouvé' });
    }

    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

module.exports = router;
