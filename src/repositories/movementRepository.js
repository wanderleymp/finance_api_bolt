const BaseRepository = require('./baseRepository');
const logger = require('../utils/logger');

class MovementRepository extends BaseRepository {
  constructor() {
    super('movements');
  }

  async findWithDetails(movementId) {
    const query = `
      SELECT 
        m.*,
        json_agg(DISTINCT jsonb_build_object(
          'movement_item_id', mi.movement_item_id,
          'item_id', mi.item_id,
          'quantity', mi.quantity,
          'unit_price', mi.unit_price,
          'total_price', mi.total_price
        )) as items,
        json_agg(DISTINCT jsonb_build_object(
          'payment_id', mp.payment_id,
          'payment_method_id', mp.payment_method_id,
          'total_amount', mp.total_amount,
          'status', mp.status
        )) as payments
      FROM movements m
      LEFT JOIN movement_items mi ON m.movement_id = mi.movement_id
      LEFT JOIN movement_payments mp ON m.movement_id = mp.movement_id
      WHERE m.movement_id = $1
      GROUP BY m.movement_id
    `;

    try {
      const result = await this.pool.query(query, [movementId]);
      return result.rows[0];
    } catch (error) {
      logger.error('Erro ao buscar movimento com detalhes:', error);
      throw error;
    }
  }

  async findByPeriod(startDate, endDate, licenseId) {
    const query = `
      SELECT * FROM movements
      WHERE movement_date BETWEEN $1 AND $2
      AND license_id = $3
      ORDER BY movement_date DESC
    `;

    try {
      const result = await this.pool.query(query, [startDate, endDate, licenseId]);
      return result.rows;
    } catch (error) {
      logger.error('Erro ao buscar movimentos por período:', error);
      throw error;
    }
  }
}

module.exports = MovementRepository;