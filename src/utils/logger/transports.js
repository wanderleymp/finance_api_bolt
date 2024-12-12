const winston = require('winston');
const path = require('path');

// Configuração dos transportes para diferentes ambientes
const createTransports = (env) => {
  const transports = [
    new winston.transports.Console({
      handleExceptions: true
    })
  ];

  if (env === 'production') {
    transports.push(
      new winston.transports.File({
        filename: path.join(process.cwd(), 'logs', 'error.log'),
        level: 'error',
        handleExceptions: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5
      }),
      new winston.transports.File({
        filename: path.join(process.cwd(), 'logs', 'combined.log'),
        handleExceptions: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5
      })
    );
  }

  return transports;
};

module.exports = createTransports;