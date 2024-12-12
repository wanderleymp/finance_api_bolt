const express = require('express');
const { body, param, query } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authMiddleware } = require('../middleware/auth');
const {
  getAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount
} = require('../controllers/accountController');

const router = express.Router();

router.get('/', authMiddleware, getAccounts);
router.get('/:id', authMiddleware, getAccountById);
router.post('/', authMiddleware, createAccount);
router.put('/:id', authMiddleware, updateAccount);
router.delete('/:id', authMiddleware, deleteAccount);

module.exports = router;