const express = require('express');
const HealthService = require('../services/healthService');
const logger = require('../utils/logger');

const router = express.Router();
const healthService = new HealthService();

/**
 * @swagger
 * /health:
 *   get:
 *     tags:
 *       - Sistema
 *     summary: Verifica a saúde do sistema
 *     description: Retorna o status de saúde da API e suas dependências
 *     responses:
 *       200:
 *         description: Sistema saudável
 *       503:
 *         description: Sistema indisponível
 */
router.get('/', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const health = await healthService.checkHealth();
    const responseTime = Date.now() - startTime;
    
    health.responseTime = `${responseTime}ms`;
    
    if (!health.database.isHealthy) {
      logger.error('Verificação de saúde falhou:', health);
      return res.status(503).json(health);
    }

    logger.info('Verificação de saúde bem-sucedida:', health);
    return res.status(200).json(health);
  } catch (error) {
    logger.error('Erro na verificação de saúde:', error);
    return res.status(503).json({
      status: 'error',
      message: 'Erro ao verificar saúde do sistema',
      timestamp: new Date().toISOString(),
      responseTime: `${Date.now() - startTime}ms`
    });
  }
});

module.exports = router;