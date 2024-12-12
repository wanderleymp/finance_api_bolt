const MovementService = require('../services/movementService');
const HttpResponse = require('../utils/httpResponse');
const asyncHandler = require('../utils/asyncHandler');

const movementService = new MovementService();

const getMovements = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const licenseId = req.user.licenseId;

  if (startDate && endDate) {
    const movements = await movementService.getMovementsByPeriod(
      startDate, 
      endDate, 
      licenseId
    );
    return HttpResponse.success(res, movements);
  }

  const movements = await movementService.getAll();
  return HttpResponse.success(res, movements);
});

const getMovementById = asyncHandler(async (req, res) => {
  const movement = await movementService.getMovementWithDetails(req.params.id);
  if (!movement) {
    return HttpResponse.notFound(res, 'Movimento não encontrado');
  }
  return HttpResponse.success(res, movement);
});

const createMovement = asyncHandler(async (req, res) => {
  const movement = await movementService.createMovement(req.body);
  return HttpResponse.created(res, movement);
});

const updateMovement = asyncHandler(async (req, res) => {
  const movement = await movementService.update(req.params.id, req.body);
  return HttpResponse.success(res, movement);
});

const deleteMovement = asyncHandler(async (req, res) => {
  await movementService.delete(req.params.id);
  return HttpResponse.noContent(res);
});

module.exports = {
  getMovements,
  getMovementById,
  createMovement,
  updateMovement,
  deleteMovement
};