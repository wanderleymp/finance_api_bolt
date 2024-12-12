const BaseService = require('./baseService');
const PersonRepository = require('../repositories/personRepository');
const logger = require('../utils/logger');

class PersonService extends BaseService {
  constructor() {
    super(new PersonRepository());
  }

  async getPersonWithDetails(personId) {
    try {
      const person = await this.repository.findWithDetails(personId);
      if (!person) {
        throw new Error('Pessoa não encontrada');
      }
      return person;
    } catch (error) {
      logger.error('Erro ao buscar pessoa com detalhes:', error);
      throw error;
    }
  }

  async createPerson(personData) {
    try {
      const { documents, contacts, addresses, ...personInfo } = personData;
      
      // Inicia uma transação
      const client = await this.repository.pool.connect();
      try {
        await client.query('BEGIN');
        
        // Cria a pessoa
        const person = await this.repository.create(personInfo);
        
        // Adiciona documentos
        if (documents && documents.length > 0) {
          for (const doc of documents) {
            await client.query(
              'INSERT INTO person_documents (person_id, document_type_id, document_value) VALUES ($1, $2, $3)',
              [person.person_id, doc.document_type_id, doc.document_value]
            );
          }
        }
        
        // Adiciona contatos
        if (contacts && contacts.length > 0) {
          for (const contact of contacts) {
            const contactResult = await client.query(
              'INSERT INTO contacts (contact_type_id, contact_value) VALUES ($1, $2) RETURNING contact_id',
              [contact.contact_type_id, contact.contact_value]
            );
            
            await client.query(
              'INSERT INTO person_contacts (person_id, contact_id) VALUES ($1, $2)',
              [person.person_id, contactResult.rows[0].contact_id]
            );
          }
        }
        
        // Adiciona endereços
        if (addresses && addresses.length > 0) {
          for (const address of addresses) {
            await client.query(
              'INSERT INTO addresses (person_id, street, number, complement, neighborhood, city, state, postal_code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
              [person.person_id, address.street, address.number, address.complement, address.neighborhood, address.city, address.state, address.postal_code]
            );
          }
        }
        
        await client.query('COMMIT');
        return await this.getPersonWithDetails(person.person_id);
        
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error('Erro ao criar pessoa:', error);
      throw error;
    }
  }
}

module.exports = PersonService;