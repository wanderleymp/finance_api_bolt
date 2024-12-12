const AccountService = require('../services/accountService');
const HttpResponse = require('../utils/httpResponse');
const asyncHandler = require('../utils/asyncHandler');

const accountService = new AccountService();

const getAccounts = asyncHandler(async (req, res) => {
  const accounts = await accountService.getAll();
  return HttpResponse.success(res, accounts);
});

const getAccountById = asyncHandler(async (req, res) => {
  const account = await accountService.getById(req.params.id);
  return HttpResponse.success(res, account);
});

const createAccount = asyncHandler(async (req, res) => {
  const account = await accountService.create(req.body);
  return HttpResponse.created(res, account);
});

const updateAccount = asyncHandler(async (req, res) => {
  const account = await accountService.update(req.params.id, req.body);
  return HttpResponse.success(res, account);
});

const deleteAccount = asyncHandler(async (req, res) => {
  await accountService.delete(req.params.id);
  return HttpResponse.noContent(res);
});

module.exports = {
  getAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount
};