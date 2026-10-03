// Route definitions for TransactionController.
// API prefix: /api/transactions

export const TRANSACTION_ROUTES = {
  BASE: 'transactions',

  GET_TRANSACTIONS: {
    method: 'GET',
    path: '',
    handler: 'getTransactions',
  },

  GET_TRANSACTION_STATS: {
    method: 'GET',
    path: 'stats',
    handler: 'getTransactionStats',
  },

  GET_TRANSACTION_BY_ID: {
    method: 'GET',
    path: ':id',
    handler: 'getTransactionById',
  },

  CREATE_TRANSACTION: {
    method: 'POST',
    path: '',
    handler: 'createTransaction',
  },

  UPDATE_TRANSACTION_STATUS: {
    method: 'PATCH',
    path: ':id/status',
    handler: 'updateTransactionStatus',
  },
} as const;
