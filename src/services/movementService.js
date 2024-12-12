const BaseService = require('./baseService');
const MovementRepository = require('../repositories/movementRepository');
const logger = require('../utils/logger');

class MovementService extends BaseService {
  constructor() {
    super(new MovementRepository());
  }

  async getMovementWithDetails(movementId) {
    try {
      const movement = await this.repository.findWithDetails(movementId);
      if (!movement) {
        throw new Error('Movimento não encontrado');
      }
      return movement;
    } catch (error) {
      logger.error('Erro ao buscar movimento com detalhes:', error);
      throw error;
    }
  }

  async createMovement(movementData) {
    try {
      const { items, payments, ...movementInfo } = movementData;
      
      const client = await this.repository.pool.connect();
      try {
        await client.query('BEGIN');
        
        // Cria o movimento
        const movement = await this.repository.create(movementInfo);
        
        // Adiciona itens
        if (items && items.length > 0) {
          for (const item of items) {
            await client.query(
              `INSERT INTO movement_items 
               (movement_id, item_id, quantity, unit_price, total_price)
               VALUES ($1, $2, $3, $4, $5)`,
              [movement.movement_id, item.item_id, item.quantity, 
               item.unit_price, item.quantity * item.unit_price]
            );
          }
        }
        
        // Adiciona pagamentos
        if (payments && payments.length > 0) {
          for (const payment of payments) {
            await client.query(
              `INSERT INTO movement_payments 
               (movement_id, payment_method_id, total_amount, status)
               VALUES ($1, $2, $3, $4)`,
              [movement.movement_id, payment.payment_method_id, 
               payment.total_amount, payment.status || 'Pendente']
            );
          }
        }
        
        await client.query('COMMIT');
        return await this.getMovementWithDetails(movement.movement_id);
        
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error('Erro ao criar movimento:', error);
      throw error;
    }
  }

  async getMovementsByPeriod(startDate, endDate, licenseId) {
    try {
      return await this.repository.findByPeriod(startDate, endDate, licenseId);
    } catch (error) {
      logger.error('Erro ao buscar movimentos por período:', error);
      throw error;
    }
  }
}

module.exports = MovementService;