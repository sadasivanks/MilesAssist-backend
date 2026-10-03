// Route definitions for DashboardController.
// API prefix: /api/dashboard

export const DASHBOARD_ROUTES = {
  BASE: 'dashboard',

  GET_DASHBOARD_STATS: {
    method: 'GET',
    path: 'stats',
    handler: 'getDashboardStats',
  },

  GET_REVENUE_CHART: {
    method: 'GET',
    path: 'charts',
    handler: 'getRevenueChart',
  },

  GET_DASHBOARD_ALERTS: {
    method: 'GET',
    path: 'alerts',
    handler: 'getDashboardAlerts',
  },
} as const;
