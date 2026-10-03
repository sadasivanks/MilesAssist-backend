export default () => ({
  port: Number(process.env.PORT ?? 3000),
  cors: { origin: process.env.CORS_ORIGIN ?? "*" },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
  },
  database: {
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT ?? 5432),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
  },
  throttle: {
    ttl: Number(process.env.THROTTLE_TTL ?? 60000),
    limit: Number(process.env.THROTTLE_LIMIT ?? 100),
  },
});
