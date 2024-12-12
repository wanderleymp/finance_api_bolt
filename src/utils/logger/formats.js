const winston = require('winston');

// Formatos personalizados para diferentes ambientes
const formats = {
  development: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),

  production: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  )
};

module.exports = formats;