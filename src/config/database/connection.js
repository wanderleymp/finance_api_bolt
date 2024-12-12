const logger = require('../../utils/logger');
const createPool = require('./pool');

class DatabaseConnection {
  constructor() {
    this.pool = createPool();
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.pool.on('connect', () => {
      logger.info('Nova conexão estabelecida com o banco de dados');
    });

    this.pool.on('error', (err) => {
      logger.error('Erro no pool de conexões:', err.message);
    });

    this.pool.on('acquire', () => {
      const { totalCount, idleCount, waitingCount } = this.pool;
      logger.debug(
        `Status do pool - Total: ${totalCount}, Livre: ${idleCount}, Aguardando: ${waitingCount}`
      );
    });
  }

  async connect(retries = 5, delay = 5000) {
    while (retries > 0) {
      try {
        const client = await this.pool.connect();
        logger.info('Conexão estabelecida com sucesso');
        client.release();
        return true;
      } catch (error) {
        retries--;
        logger.error(`Falha na conexão. Tentativas restantes: ${retries}`);
        
        if (retries === 0) {
          logger.error('Todas as tentativas de conexão falharam');
          throw error;
        }

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  async close() {
    try {
      await this.pool.end();
      logger.info('Conexões do banco de dados encerradas');
    } catch (error) {
      logger.error('Erro ao encerrar conexões:', error.message);
      throw error;
    }
  }
}

module.exports = new DatabaseConnection();