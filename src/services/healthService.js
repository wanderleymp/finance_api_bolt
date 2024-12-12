const DatabaseService = require('./databaseService');
const os = require('os');

class HealthService {
  constructor() {
    this.dbService = new DatabaseService();
  }

  async checkHealth() {
    const dbHealth = await this.dbService.checkHealth();
    
    return {
      status: dbHealth.isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      database: dbHealth,
      system: {
        uptime: process.uptime(),
        memory: {
          total: os.totalmem(),
          free: os.freemem(),
          used: os.totalmem() - os.freemem()
        },
        cpu: os.loadavg()
      }
    };
  }
}

module.exports = HealthService;