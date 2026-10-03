# API Reference

All endpoints use `/api` as the global prefix. Protected endpoints require `Authorization: Bearer <JWT>`.

## Readable method mapping

| API | Controller method | Service method |
|---|---|---|
| GET `/api/users` | `getUsers` | `getUsers` |
| GET `/api/users/:id` | `getUserById` | `getUserById` |
| POST `/api/users` | `createUser` | `createUser` |
| PATCH `/api/users/:id` | `updateUser` | `updateUser` |
| DELETE `/api/users/:id` | `deleteUser` | `deleteUser` |
| GET `/api/bookings` | `getBookings` | `getBookings` |
| GET `/api/bookings/:id` | `getBookingById` | `getBookingById` |
| POST `/api/bookings` | `createBooking` | `createBooking` |
| PATCH `/api/bookings/:id` | `updateBooking` | `updateBooking` |
| GET `/api/transactions` | `getTransactions` | `getTransactions` |
| GET `/api/transactions/:id` | `getTransactionById` | `getTransactionById` |
| POST `/api/transactions` | `createTransaction` | `createTransaction` |
| PATCH `/api/transactions/:id/status` | `updateTransactionStatus` | `updateTransactionStatus` |
| GET `/api/dashboard/stats` | `getDashboardStats` | `getDashboardStats` |
| GET `/api/dashboard/charts` | `getRevenueChart` | `getRevenueChart` |
| GET `/api/dashboard/alerts` | `getDashboardAlerts` | `getDashboardAlerts` |
