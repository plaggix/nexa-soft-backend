const express = require('express');
const prisma = require('../lib/prisma');

const router = express.Router();

// GET /api/projects — Fetch all projects with service info
router.get('/', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: { service: true },
      orderBy: { name: 'asc' },
    });

    res.json({ success: true, data: projects });
  } catch (error) {
    console.error('Projects fetch error:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des projets' });
  }
});

module.exports = router;
