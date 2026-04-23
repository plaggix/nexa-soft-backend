const express = require('express');
const prisma = require('../lib/prisma');

const router = express.Router();

// Simple token-based auth middleware
const adminAuth = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token || token !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return res.status(401).json({ success: false, error: 'Accès non autorisé' });
  }
  next();
};

// GET /api/admin/contacts — List all contact messages
router.get('/contacts', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      prisma.contact.count(),
    ]);

    res.json({
      success: true,
      data: contacts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Admin contacts error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// GET /api/admin/stats — Dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [totalContacts, totalServices, totalProjects, recentContacts] = await Promise.all([
      prisma.contact.count(),
      prisma.service.count(),
      prisma.project.count(),
      prisma.contact.findMany({
        orderBy: { created_at: 'desc' },
        take: 5,
        select: { id: true, full_name: true, email: true, subject: true, created_at: true },
      }),
    ]);

    res.json({
      success: true,
      data: { totalContacts, totalServices, totalProjects, recentContacts },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// DELETE /api/admin/contacts/:id — Delete a contact message
router.delete('/contacts/:id', adminAuth, async (req, res) => {
  try {
    await prisma.contact.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Message supprimé' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la suppression' });
  }
});

module.exports = router;
