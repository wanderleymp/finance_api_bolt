const logger = require('./index');

// Função para testar o logger
const testLogger = () => {
  try {
    logger.info('Teste de log - INFO');
    logger.debug('Teste de log - DEBUG');
    logger.error('Teste de log - ERROR');
    return true;
  } catch (error) {
    console.error('Erro ao testar logger:', error);
    return false;
  }
};

module.exports = { testLogger };