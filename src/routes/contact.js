const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../lib/prisma');
const { sendContactNotification } = require('../lib/mailer');

const router = express.Router();

// POST /api/contact — Submit contact form
router.post(
  '/',
  [
    body('full_name').trim().notEmpty().withMessage('Le nom complet est requis'),
    body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
    body('subject').trim().notEmpty().withMessage('Le sujet est requis'),
    body('message').trim().isLength({ min: 10 }).withMessage('Le message doit contenir au moins 10 caractères'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { full_name, email, subject, message } = req.body;

    try {
      // 1. Sauvegarder en base de données
      const contact = await prisma.contact.create({
        data: { full_name, email, subject, message },
      });

      // 2. Envoyer la notification email (non-bloquant)
      sendContactNotification({ full_name, email, subject, message })
        .then(() => console.log(`✅ Email envoyé pour le contact ${contact.id}`))
        .catch((err) => console.error('⚠️  Email non envoyé (vérifier GMAIL_APP_PASSWORD) :', err.message));

      // 3. Répondre immédiatement au client
      res.status(201).json({
        success: true,
        message: 'Votre message a été envoyé avec succès. Nous vous répondrons sous 24h.',
        data: {
          id: contact.id,
          created_at: contact.created_at,
          whatsapp_url: `https://wa.me/${process.env.WHATSAPP_NUMBER}?text=${encodeURIComponent(
            `Bonjour Nexa Soft,\n\nJe suis ${full_name}. Je viens de vous envoyer un message via votre site concernant : "${subject}".\n\nCordialement.`
          )}`,
        },
      });
    } catch (error) {
      console.error('Contact creation error:', error);
      res.status(500).json({ success: false, error: "Erreur lors de l'envoi du message" });
    }
  }
);

module.exports = router;
