const pool = require('./pool');
const logger = require('../../utils/logger');

const Database = {
  async init() {
    try {
      await pool.connect();
      logger.info('Banco de dados inicializado com sucesso');
      return pool;
    } catch (error) {
      logger.error('Falha na inicialização do banco:', error);
      throw error;
    }
  },

  async close() {
    try {
      await pool.close();
      logger.info('Conexão com banco de dados encerrada');
    } catch (error) {
      logger.error('Erro ao encerrar banco:', error);
      throw error;
    }
  },

  pool
};

// Tratamento de encerramento gracioso
process.on('SIGTERM', async () => {
  await Database.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await Database.close();
  process.exit(0);
});

module.exports = Database;