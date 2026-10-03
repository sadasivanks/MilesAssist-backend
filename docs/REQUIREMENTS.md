# Requirements Discovery

This implementation is based on the dashboard, Users, Transactions and Bookings details supplied for the assignment.

## Layer structure

The code is intentionally organized by layer so an interviewer can read an API from route -> controller -> service -> entity:

```text
src/controller/
src/service/
src/router/
src/entity/
src/dto/
src/module/
```

Method names are deliberately descriptive: `getUsers`, `getUserById`, `createUser`, `updateUser`, `deleteUser`, `getBookings`, `getBookingById`, `createBooking`, `updateBooking`, `getTransactions`, `getTransactionById`, `createTransaction`, `updateTransactionStatus`.

## API mapping

| API | Controller | Service | Router constant |
|---|---|---|---|
| GET `/api/users` | `getUsers` | `getUsers` | `USER_ROUTES.LIST` |
| GET `/api/users/:id` | `getUserById` | `getUserById` | `USER_ROUTES.DETAILS` |
| POST `/api/users` | `createUser` | `createUser` | `USER_ROUTES.CREATE` |
| PATCH `/api/users/:id` | `updateUser` | `updateUser` | `USER_ROUTES.UPDATE` |
| DELETE `/api/users/:id` | `deleteUser` | `deleteUser` | `USER_ROUTES.DELETE` |
| GET `/api/bookings` | `getBookings` | `getBookings` | `BOOKING_ROUTES.LIST` |
| GET `/api/bookings/:id` | `getBookingById` | `getBookingById` | `BOOKING_ROUTES.DETAILS` |
| POST `/api/bookings` | `createBooking` | `createBooking` | `BOOKING_ROUTES.CREATE` |
| PATCH `/api/bookings/:id` | `updateBooking` | `updateBooking` | `BOOKING_ROUTES.UPDATE` |
| GET `/api/transactions` | `getTransactions` | `getTransactions` | `TRANSACTION_ROUTES.LIST` |
| GET `/api/transactions/:id` | `getTransactionById` | `getTransactionById` | `TRANSACTION_ROUTES.DETAILS` |
| POST `/api/transactions` | `createTransaction` | `createTransaction` | `TRANSACTION_ROUTES.CREATE` |
| PATCH `/api/transactions/:id/status` | `updateTransactionStatus` | `updateTransactionStatus` | `TRANSACTION_ROUTES.UPDATE_STATUS` |
| GET `/api/dashboard/stats` | `getDashboardStats` | `getDashboardStats` | `DASHBOARD_ROUTES.STATS` |
| GET `/api/dashboard/charts` | `getRevenueChart` | `getRevenueChart` | `DASHBOARD_ROUTES.CHARTS` |
| GET `/api/dashboard/alerts` | `getDashboardAlerts` | `getDashboardAlerts` | `DASHBOARD_ROUTES.ALERTS` |

## Dashboard

- Total Users, Total Revenue, Active Bookings and Pending Transactions are calculated from PostgreSQL.
- Revenue chart supports `7D`, `1M`, `3M`, `6M`, and `1Y` through the `range` query parameter.
- Recent transactions are returned from PostgreSQL in dashboard stats.
- System alerts are persisted in `dashboard_alerts`, including the supplied capacity, pending review and maintenance examples.

## Users

Supports pagination, DB-level search, status/date filters and whitelisted sorting. User delete is a soft delete.

## Transactions

Supports pagination, DB-level search, status/type/date filters, amount minimum/maximum and whitelisted sorting. Money is stored as PostgreSQL `numeric(14,2)`.

## Bookings

Supports pagination, DB-level search, status/service/date filters and whitelisted sorting. Booking update can reschedule, change service, duration, amount or status.

## Security

JWT authentication, bcrypt password hashing, global DTO validation, Helmet, CORS, throttling, protected business routes and environment-based secrets are included.
