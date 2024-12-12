const { pool } = require('../config/database');
const logger = require('../utils/logger');

class DatabaseService {
  async checkHealth() {
    const startTime = Date.now();
    let client;
    
    try {
      client = await pool.connect();
      await client.query('SELECT 1');
      
      const poolStatus = {
        total: pool.totalCount,
        idle: pool.idleCount,
        waiting: pool.waitingCount
      };

      return {
        isHealthy: true,
        responseTime: `${Date.now() - startTime}ms`,
        poolStatus,
        lastCheck: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Erro na verificação de saúde do banco:', error);
      
      return {
        isHealthy: false,
        error: error.message,
        responseTime: `${Date.now() - startTime}ms`,
        lastCheck: new Date().toISOString()
      };
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  async testQuery(query = 'SELECT NOW()') {
    const startTime = Date.now();
    let client;

    try {
      client = await pool.connect();
      const result = await client.query(query);
      
      return {
        success: true,
        responseTime: `${Date.now() - startTime}ms`,
        result: result.rows[0]
      };
    } catch (error) {
      logger.error('Erro ao executar query de teste:', error);
      
      return {
        success: false,
        error: error.message,
        responseTime: `${Date.now() - startTime}ms`
      };
    } finally {
      if (client) {
        client.release();
      }
    }
  }
}

module.exports = DatabaseService;