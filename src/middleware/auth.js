const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        status: 'error',
        message: 'Token de autenticação não fornecido' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Erro de autenticação:', error);
    res.status(401).json({ 
      status: 'error',
      message: 'Token inválido ou expirado' 
    });
  }
};

module.exports = { authMiddleware };