const winston = require('winston');

// Configuração básica do logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} ${level}: ${message}`;
        })
      )
    })
  ]
});

// Wrapper para garantir tratamento seguro de mensagens
const safeLog = (level, message, meta = {}) => {
  try {
    if (message instanceof Error) {
      logger[level](message.message, { 
        stack: message.stack,
        ...meta 
      });
    } else if (typeof message === 'object') {
      logger[level](JSON.stringify(message), meta);
    } else {
      logger[level](message, meta);
    }
  } catch (error) {
    console.error('Erro ao registrar log:', error);
    console.log(level, message);
  }
};

// Interface segura para logging
module.exports = {
  error: (msg, meta) => safeLog('error', msg, meta),
  warn: (msg, meta) => safeLog('warn', msg, meta),
  info: (msg, meta) => safeLog('info', msg, meta),
  debug: (msg, meta) => safeLog('debug', msg, meta),
  stream: {
    write: (message) => {
      safeLog('info', message.trim());
    }
  }
};