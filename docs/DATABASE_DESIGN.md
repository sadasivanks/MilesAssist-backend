# Database Design


## Tables

### admins
`id`, `name`, `email`, `password_hash`, `status`, `role`, `created_at`, `updated_at`.

### users
`id`, `name`, `email`, `phone`, `role`, `status`, `last_active_at`, `created_at`, `updated_at`, `deleted_at`.

### transactions
`id`, `transaction_id`, `user_id`, `type`, `amount numeric(14,2)`, `status`, `transaction_date`, `created_at`, `updated_at`.

### bookings
`id`, `booking_id`, `user_id`, `service`, `service_date`, `duration`, `status`, `amount numeric(14,2)`, `created_at`, `updated_at`.

### dashboard_alerts
`id`, `title`, `action`, `status`, `created_at`.

## Relationships

- User 1:N Transaction
- User 1:N Booking
- Admin is separate from business users and is used for dashboard authentication.

## Indexes

- `users(status, created_at)`
- `transactions(status, created_at)`
- `transactions(transaction_date)`
- `bookings(status, service_date)`
- `bookings(created_at)`
- Unique indexes on user email and transaction/booking references.

