const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./authRoutes');
const personRoutes = require('./personRoutes');
const movementRoutes = require('./movementRoutes');
const accountRoutes = require('./accountRoutes');

// Register routes
router.use('/auth', authRoutes);
router.use('/persons', personRoutes);
router.use('/movements', movementRoutes);
router.use('/accounts', accountRoutes);

module.exports = router;