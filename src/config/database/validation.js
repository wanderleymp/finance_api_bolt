const logger = require('../../utils/logger');

class DatabaseConfigValidator {
  static validate() {
    const config = {
      url: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production',
      poolMax: process.env.DB_POOL_MAX,
      idleTimeout: process.env.DB_IDLE_TIMEOUT,
      connectionTimeout: process.env.DB_CONNECTION_TIMEOUT
    };

    const issues = [];

    if (!config.url) {
      issues.push('DATABASE_URL não está definida');
    }

    if (config.url) {
      try {
        const url = new URL(config.url);
        if (!['postgres:', 'postgresql:'].includes(url.protocol)) {
          issues.push('Protocolo de banco inválido');
        }
      } catch (error) {
        issues.push('URL do banco inválida');
      }
    }

    return {
      isValid: issues.length === 0,
      issues,
      config: {
        ...config,
        url: '[REDACTED]'
      }
    };
  }
}

module.exports = DatabaseConfigValidator;