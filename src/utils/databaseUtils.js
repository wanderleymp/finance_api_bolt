const { pool } = require('../config/database');
const logger = require('./logger');

class DatabaseUtils {
  static async testConnection() {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT NOW()');
      logger.info('Teste de conexão bem sucedido:', result.rows[0]);
      client.release();
      return true;
    } catch (error) {
      logger.error('Teste de conexão falhou:', error.message);
      return false;
    }
  }

  static validateConfig() {
    const config = {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production'
    };

    const issues = [];

    if (!config.connectionString) {
      issues.push('DATABASE_URL não está definida');
    }

    if (config.connectionString) {
      try {
        const url = new URL(config.connectionString);
        if (url.protocol !== 'postgres:' && url.protocol !== 'postgresql:') {
          issues.push('Protocolo de banco inválido - deve ser postgres:// ou postgresql://');
        }
      } catch (error) {
        issues.push('Formato de DATABASE_URL inválido');
      }
    }

    return {
      isValid: issues.length === 0,
      issues,
      config: {
        ...config,
        connectionString: config.connectionString ? '[REDACTED]' : undefined
      }
    };
  }

  static async checkDatabaseStatus() {
    const status = {
      connection: false,
      config: this.validateConfig(),
      poolStatus: {
        totalCount: pool.totalCount,
        idleCount: pool.idleCount,
        waitingCount: pool.waitingCount
      }
    };

    try {
      status.connection = await this.testConnection();
    } catch (error) {
      logger.error('Erro ao verificar status do banco:', error.message);
    }

    return status;
  }
}

module.exports = DatabaseUtils;