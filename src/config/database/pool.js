const { Pool } = require('pg');
const logger = require('../../utils/logger');
const DatabaseConfigValidator = require('./validation');

class DatabasePool {
  constructor() {
    const validation = DatabaseConfigValidator.validate();
    
    if (!validation.isValid) {
      throw new Error(`Configuração inválida: ${validation.issues.join(', ')}`);
    }

    this.pool = this.createPool();
    this.setupEventHandlers();
  }

  createPool() {
    return new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
      } : false,
      max: parseInt(process.env.DB_POOL_MAX || '20'),
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
      connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '5000'),
      allowExitOnIdle: true
    });
  }

  setupEventHandlers() {
    this.pool.on('connect', () => {
      logger.info('Nova conexão estabelecida');
    });

    this.pool.on('error', (err) => {
      logger.error('Erro no pool:', err.message);
    });
  }

  async connect() {
    let retries = 5;
    const retryDelay = 5000;

    while (retries > 0) {
      try {
        const client = await this.pool.connect();
        await client.query('SELECT 1'); // Teste simples
        client.release(true); // Force release
        logger.info('Conexão estabelecida com sucesso');
        return true;
      } catch (error) {
        retries--;
        logger.error(`Falha na conexão. Tentativas restantes: ${retries}`, error);
        if (retries === 0) throw error;
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }

  async close() {
    try {
      await this.pool.end();
      logger.info('Pool de conexões encerrado');
    } catch (error) {
      logger.error('Erro ao encerrar pool de conexões:', error);
      throw error;
    }
  }

  getPool() {
    return this.pool;
  }

  query(...args) {
    return this.pool.query(...args);
  }
}

module.exports = new DatabasePool();