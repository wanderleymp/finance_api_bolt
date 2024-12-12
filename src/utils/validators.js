const { ValidationError } = require('./errorTypes');

class Validators {
  static validateRequired(value, fieldName) {
    if (value === undefined || value === null || value === '') {
      throw new ValidationError(`${fieldName} é obrigatório`);
    }
  }

  static validateNumber(value, fieldName) {
    if (isNaN(value)) {
      throw new ValidationError(`${fieldName} deve ser um número válido`);
    }
  }

  static validatePositive(value, fieldName) {
    this.validateNumber(value, fieldName);
    if (value <= 0) {
      throw new ValidationError(`${fieldName} deve ser maior que zero`);
    }
  }

  static validateDate(value, fieldName) {
    if (!(value instanceof Date) || isNaN(value)) {
      throw new ValidationError(`${fieldName} deve ser uma data válida`);
    }
  }

  static validateEnum(value, validValues, fieldName) {
    if (!validValues.includes(value)) {
      throw new ValidationError(`${fieldName} deve ser um dos seguintes valores: ${validValues.join(', ')}`);
    }
  }

  static validateLength(value, min, max, fieldName) {
    if (value.length < min || value.length > max) {
      throw new ValidationError(`${fieldName} deve ter entre ${min} e ${max} caracteres`);
    }
  }
}

module.exports = Validators;