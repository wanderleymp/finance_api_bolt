const winston = require('winston');

// Configuração simplificada para evitar problemas com ArrayBuffer
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      const msg = typeof message === 'object' ? JSON.stringify(message) : message;
      return `${timestamp} ${level}: ${msg}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      handleExceptions: true
    })
  ],
  exitOnError: false
});

// Interface segura
module.exports = {
  error: (msg, meta) => {
    try {
      logger.error(msg, meta);
    } catch (err) {
      console.error(msg);
    }
  },
  info: (msg, meta) => {
    try {
      logger.info(msg, meta);
    } catch (err) {
      console.log(msg);
    }
  },
  debug: (msg, meta) => {
    try {
      logger.debug(msg, meta);
    } catch (err) {
      console.log(msg);
    }
  },
  stream: {
    write: (message) => {
      try {
        logger.info(message.trim());
      } catch (err) {
        console.log(message);
      }
    }
  }
};