export function validateEnv(config: Record<string, any>) {
  const required = [
    "DATABASE_HOST",
    "DATABASE_USERNAME",
    "DATABASE_PASSWORD",
    "DATABASE_NAME",
    "JWT_SECRET",
  ];
  for (const key of required)
    if (!config[key]) throw new Error(`${key} is required`);
  if (String(config.JWT_SECRET).length < 16)
    throw new Error("JWT_SECRET must contain at least 16 characters");
  return config;
}
