class HttpResponse {
  static success(res, data, message = 'Operação realizada com sucesso', statusCode = 200) {
    return res.status(statusCode).json({
      status: 'success',
      message,
      data
    });
  }

  static error(res, message = 'Erro interno do servidor', statusCode = 500, errors = null) {
    const response = {
      status: 'error',
      message
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  static created(res, data, message = 'Recurso criado com sucesso') {
    return this.success(res, data, message, 201);
  }

  static noContent(res) {
    return res.status(204).send();
  }

  static badRequest(res, message = 'Requisição inválida', errors = null) {
    return this.error(res, message, 400, errors);
  }

  static unauthorized(res, message = 'Não autorizado') {
    return this.error(res, message, 401);
  }

  static forbidden(res, message = 'Acesso negado') {
    return this.error(res, message, 403);
  }

  static notFound(res, message = 'Recurso não encontrado') {
    return this.error(res, message, 404);
  }
}

module.exports = HttpResponse;