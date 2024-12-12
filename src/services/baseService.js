const logger = require('../utils/logger');

class BaseService {
  constructor(repository) {
    this.repository = repository;
  }

  async getAll(options = {}) {
    try {
      return await this.repository.findAll(options);
    } catch (error) {
      logger.error('Erro no serviço ao buscar todos os registros:', error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const item = await this.repository.findById(id);
      if (!item) {
        throw new Error('Registro não encontrado');
      }
      return item;
    } catch (error) {
      logger.error('Erro no serviço ao buscar registro por ID:', error);
      throw error;
    }
  }

  async create(data) {
    try {
      return await this.repository.create(data);
    } catch (error) {
      logger.error('Erro no serviço ao criar registro:', error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const item = await this.repository.update(id, data);
      if (!item) {
        throw new Error('Registro não encontrado');
      }
      return item;
    } catch (error) {
      logger.error('Erro no serviço ao atualizar registro:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      return await this.repository.delete(id);
    } catch (error) {
      logger.error('Erro no serviço ao deletar registro:', error);
      throw error;
    }
  }
}

module.exports = BaseService;