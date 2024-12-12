const BaseRepository = require('./baseRepository');
const logger = require('../utils/logger');

class PersonRepository extends BaseRepository {
  constructor() {
    super('persons');
  }

  async findByDocument(documentValue) {
    const query = `
      SELECT p.* FROM persons p
      INNER JOIN person_documents pd ON p.person_id = pd.person_id
      WHERE pd.document_value = $1
    `;
    
    try {
      const result = await this.pool.query(query, [documentValue]);
      return result.rows[0];
    } catch (error) {
      logger.error('Erro ao buscar pessoa por documento:', error);
      throw error;
    }
  }

  async findWithDetails(personId) {
    const query = `
      SELECT 
        p.*,
        json_agg(DISTINCT jsonb_build_object(
          'document_type', dt.description,
          'document_value', pd.document_value
        )) as documents,
        json_agg(DISTINCT jsonb_build_object(
          'contact_type', ct.description,
          'contact_value', c.contact_value
        )) as contacts,
        json_agg(DISTINCT jsonb_build_object(
          'address_id', a.address_id,
          'street', a.street,
          'number', a.number,
          'complement', a.complement,
          'neighborhood', a.neighborhood,
          'city', a.city,
          'state', a.state,
          'postal_code', a.postal_code
        )) as addresses
      FROM persons p
      LEFT JOIN person_documents pd ON p.person_id = pd.person_id
      LEFT JOIN document_types dt ON pd.document_type_id = dt.document_type_id
      LEFT JOIN person_contacts pc ON p.person_id = pc.person_id
      LEFT JOIN contacts c ON pc.contact_id = c.contact_id
      LEFT JOIN contact_types ct ON c.contact_type_id = ct.contact_type_id
      LEFT JOIN addresses a ON p.person_id = a.person_id
      WHERE p.person_id = $1
      GROUP BY p.person_id
    `;

    try {
      const result = await this.pool.query(query, [personId]);
      return result.rows[0];
    } catch (error) {
      logger.error('Erro ao buscar pessoa com detalhes:', error);
      throw error;
    }
  }
}

module.exports = PersonRepository;