import dotenv from 'dotenv';
import { z } from 'zod';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Zod schema for environment variable validation
const envSchema = z.object({
  PORT: z.string().default('5002'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGO_URI: z.string().url('MONGO_URI must be a valid MongoDB connection string'),
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  ACCESS_TOKEN_EXPIRES: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRES: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('*'),
  UPLOAD_DIR: z.string().default('./uploads'),
  SALT_ROUNDS: z.string().regex(/^\d+$/).transform(Number).default('12'),
});

// Validate and parse environment variables
const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parseResult.error.format());
  throw new Error('Environment variable validation failed. Please check your .env file.');
}

// Export typed config object
export const config = {
  port: parseInt(parseResult.data.PORT, 10),
  nodeEnv: parseResult.data.NODE_ENV,
  mongoUri: parseResult.data.MONGO_URI,
  jwt: {
    accessSecret: parseResult.data.JWT_ACCESS_SECRET,
    refreshSecret: parseResult.data.JWT_REFRESH_SECRET,
    accessExpires: parseResult.data.ACCESS_TOKEN_EXPIRES,
    refreshExpires: parseResult.data.REFRESH_TOKEN_EXPIRES,
  },
  cors: {
    origin: parseResult.data.CORS_ORIGIN.split(',').map((o) => o.trim()),
  },
  upload: {
    dir: parseResult.data.UPLOAD_DIR,
  },
  bcrypt: {
    saltRounds: parseResult.data.SALT_ROUNDS,
  },
} as const;

// Type export for config
export type Config = typeof config;

