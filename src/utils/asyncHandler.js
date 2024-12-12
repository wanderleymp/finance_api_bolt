const HttpResponse = require('./httpResponse');
const logger = require('./logger');

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .catch((error) => {
      logger.error('Erro na requisição:', error);
      
      if (error.name === 'ValidationError') {
        return HttpResponse.badRequest(res, error.message);
      }
      
      if (error.name === 'NotFoundError') {
        return HttpResponse.notFound(res, error.message);
      }
      
      return HttpResponse.error(res, error.message);
    });
};

module.exports = asyncHandler;