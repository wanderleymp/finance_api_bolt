const { pool } = require('../config/database');
const logger = require('../utils/logger');

class BaseRepository {
  constructor(table) {
    this.table = table;
    this.pool = pool;
  }

  async findAll(options = {}) {
    const { where = '', params = [], orderBy = 'id' } = options;
    const query = `SELECT * FROM ${this.table} ${where} ORDER BY ${orderBy}`;
    
    try {
      const result = await this.pool.query(query, params);
      return result.rows;
    } catch (error) {
      logger.error(`Erro ao buscar registros em ${this.table}:`, error);
      throw error;
    }
  }

  // ... resto dos métodos permanece igual
}

module.exports = BaseRepository;