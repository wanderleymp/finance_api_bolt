const PersonService = require('../services/personService');
const HttpResponse = require('../utils/httpResponse');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../utils/logger');

const personService = new PersonService();

const getPersons = asyncHandler(async (req, res) => {
  const persons = await personService.getAll();
  return HttpResponse.success(res, persons);
});

const getPersonById = asyncHandler(async (req, res) => {
  const person = await personService.getPersonWithDetails(req.params.id);
  if (!person) {
    return HttpResponse.notFound(res, 'Pessoa não encontrada');
  }
  return HttpResponse.success(res, person);
});

const createPerson = asyncHandler(async (req, res) => {
  const person = await personService.createPerson(req.body);
  return HttpResponse.created(res, person);
});

const updatePerson = asyncHandler(async (req, res) => {
  const person = await personService.update(req.params.id, req.body);
  return HttpResponse.success(res, person);
});

const deletePerson = asyncHandler(async (req, res) => {
  await personService.delete(req.params.id);
  return HttpResponse.noContent(res);
});

module.exports = {
  getPersons,
  getPersonById,
  createPerson,
  updatePerson,
  deletePerson
};