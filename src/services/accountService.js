const BaseService = require('./baseService');
const AccountRepository = require('../repositories/accountRepository');

class AccountService extends BaseService {
  constructor() {
    super(new AccountRepository());
  }
}

module.exports = AccountService;