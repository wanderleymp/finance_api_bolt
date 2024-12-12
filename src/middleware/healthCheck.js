const HealthService = require('../services/healthService');
const logger = require('../utils/logger');

const healthService = new HealthService();

const healthCheck = async (req, res, next) => {
  try {
    const health = await healthService.checkHealth();
    
    if (!health.database.isHealthy) {
      logger.error('Verificação de saúde falhou no middleware:', health);
      return res.status(503).json({
        status: 'error',
        message: 'Serviço temporariamente indisponível',
        timestamp: new Date().toISOString()
      });
    }
    
    next();
  } catch (error) {
    logger.error('Erro no middleware de saúde:', error);
    return res.status(503).json({
      status: 'error',
      message: 'Erro ao verificar saúde do sistema',
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = healthCheck;