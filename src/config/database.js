const { Pool } = require('pg');
const logger = require('../utils/logger');
require('dotenv').config();

const createPool = () => {
  // Validação da configuração
  if (!process.env.DATABASE_URL) {
    logger.error('DATABASE_URL não está definida');
    throw new Error('Configuração de banco de dados ausente');
  }

  const config = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: false
    } : false,
    max: parseInt(process.env.DB_POOL_MAX || '20'),
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
    connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '5000'),
  };

  const pool = new Pool(config);

  // Handlers de eventos simplificados
  pool.on('connect', () => {
    logger.info('Nova conexão estabelecida');
  });

  pool.on('error', (err) => {
    logger.error('Erro no pool:', err.message);
  });

  return pool;
};

const pool = createPool();

const connectDB = async () => {
  let retries = 5;
  const retryDelay = 5000;

  while (retries > 0) {
    try {
      const client = await pool.connect();
      logger.info('Conexão estabelecida com sucesso');
      client.release();
      return true;
    } catch (error) {
      retries--;
      logger.error(`Falha na conexão. Tentativas restantes: ${retries}`);
      
      if (retries === 0) {
        logger.error('Todas as tentativas falharam');
        throw error;
      }

      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
};

const closeDB = async () => {
  try {
    await pool.end();
    logger.info('Conexões encerradas');
  } catch (error) {
    logger.error('Erro ao encerrar conexões:', error.message);
    throw error;
  }
};

// Tratamento de encerramento
process.on('SIGINT', async () => {
  logger.info('Encerrando aplicação...');
  await closeDB();
  process.exit(0);
});

module.exports = {
  pool,
  connectDB,
  closeDB
};