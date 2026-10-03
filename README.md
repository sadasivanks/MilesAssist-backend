# Miles Admin Backend

NestJS + TypeScript + PostgreSQL + TypeORM REST API for the admin dashboard practical assignment.

## Structure

The project intentionally uses a simple layer-based structure so each API is easy to follow:

- `src/controller/` - HTTP endpoints. Method names are explicit: `getUsers`, `getUserById`, `createUser`, `updateUser`, `deleteUser`.
- `src/service/` - business and database logic with the same readable method names.
- `src/router/` - route path constants used directly by controllers.
- `src/entity/` - TypeORM PostgreSQL entities.
- `src/dto/` - request validation DTOs.
- `src/module/` - NestJS modules.
- `src/guard/` and `src/strategy/` - JWT authentication.

## API routes

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/users`
- `GET /api/users/stats`
- `GET /api/users/:id`
- `POST /api/users`
- `PATCH /api/users/:id`
- `DELETE /api/users/:id`
- `GET /api/transactions`
- `GET /api/transactions/stats`
- `GET /api/transactions/:id`
- `POST /api/transactions`
- `PATCH /api/transactions/:id/status`
- `GET /api/bookings`
- `GET /api/bookings/stats`
- `GET /api/bookings/:id`
- `POST /api/bookings`
- `PATCH /api/bookings/:id`
- `GET /api/dashboard/stats`
- `GET /api/dashboard/charts`
- `GET /api/dashboard/alerts`

## Setup

1. Copy `.env.example` to `.env`.
2. Set the PostgreSQL database values and a JWT secret of at least 16 characters.
3. Run `npm install`.
4. Run `npm run migration:run`.
5. Run `npm run seed`.
6. Run `npm run start:dev`.
7. Swagger: `http://localhost:3000/api/docs`.

## Development login

Email: `admin@example.com`  
Password: `Admin@123`

The password is bcrypt-hashed during seeding and is never returned by the API.

## Notes

- `synchronize` is disabled.
- List endpoints use DB-level filtering, pagination and whitelisted sorting.
- Money is stored as PostgreSQL `numeric(14,2)`.
- User deletion is a soft delete/deactivation.
- Dashboard values are queried from PostgreSQL; seeded dashboard alerts are stored in `dashboard_alerts`.

## Route / Controller / Service structure

This project intentionally keeps the code easy to read for developers coming from an Express-style backend.

- `src/router/` contains the route map for every module. Each route includes the HTTP method, path and the controller function name.
- `src/controller/` contains only request/response handling and calls the matching service function.
- `src/service/` contains the actual business and database logic.
- `src/entity/` contains the TypeORM PostgreSQL entities.
- `src/dto/` contains request validation objects.

Example:

`GET /api/users` -> `USER_ROUTES.GET_USERS` -> `UserController.getUsers()` -> `UserService.getUsers()` -> `User` entity/repository.

The router files are route-definition files rather than raw Express `Router()` instances because this is a NestJS application. NestJS registers HTTP routes through controller decorators; the route files make those routes explicit and easy to trace without replacing NestJS's routing and dependency-injection system.
