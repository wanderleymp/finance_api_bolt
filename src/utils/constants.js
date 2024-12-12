// Constantes do sistema
const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

const MOVEMENT_TYPES = {
  SALE: 'sale',
  PURCHASE: 'purchase',
  TRANSFER: 'transfer',
  ADJUSTMENT: 'adjustment'
};

const ACCOUNT_TYPES = {
  ASSET: 'asset',
  LIABILITY: 'liability',
  EQUITY: 'equity',
  REVENUE: 'revenue',
  EXPENSE: 'expense'
};

const ERROR_MESSAGES = {
  NOT_FOUND: 'Recurso não encontrado',
  UNAUTHORIZED: 'Não autorizado',
  FORBIDDEN: 'Acesso negado',
  VALIDATION: 'Erro de validação',
  INTERNAL: 'Erro interno do servidor'
};

module.exports = {
  STATUS,
  MOVEMENT_TYPES,
  ACCOUNT_TYPES,
  ERROR_MESSAGES
};