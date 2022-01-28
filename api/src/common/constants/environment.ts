export const processEnv = {
  SERVER_URL: process.env.SERVER_URL,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
};
export enum ProcessEnvEnum {
  SERVER_URL = 'SERVER_URL',
  PORT = 'PORT',
  DATABASE_URL = 'DATABASE_URL',
  NODE_ENV = 'NODE_ENV',
  JWT_SECRET = 'JWT_SECRET',
}
