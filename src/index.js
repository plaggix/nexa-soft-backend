require('dotenv').config();
console.log("DB_URL check:", process.env.DATABASE_URL ? "Variable présente" : "Variable manquante");
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const contactRoutes = require('./routes/contact');
const servicesRoutes = require('./routes/services');
const projectsRoutes = require('./routes/projects');
const adminRoutes = require('./routes/admin');

const app = express();
const prisma = new PrismaClient({
  datasource: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://nexa-soft-lake.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Nexa Soft API is running 🚀', timestamp: new Date() });
});

// Routes
app.use('/api/contact', contactRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Start server
app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL (nexasoft_db)');
    console.log(`🚀 Nexa Soft API running on http://localhost:${PORT}`);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
});

module.exports = app;
