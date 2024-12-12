const BaseRepository = require('./baseRepository');

class AccountRepository extends BaseRepository {
  constructor() {
    super('accounts');
  }
}

module.exports = AccountRepository;