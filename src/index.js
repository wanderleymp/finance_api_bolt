require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const Database = require('./config/database');
const logger = require('./utils/logger');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: logger.stream }));

// Rotas
app.use('/api', routes);

// Inicialização do servidor
const startServer = async () => {
  try {
    // Inicializa o banco de dados
    await Database.init();
    
    // Inicia o servidor Express
    const server = app.listen(port, () => {
      logger.info(`Servidor rodando na porta ${port}`);
    });

    // Tratamento de encerramento gracioso
    process.on('SIGTERM', async () => {
      logger.info('Recebido sinal SIGTERM. Encerrando servidor...');
      server.close(async () => {
        await Database.close();
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      logger.info('Recebido sinal SIGINT. Encerrando servidor...');
      server.close(async () => {
        await Database.close();
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('Falha ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();