import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    PORT: z.string().default('3000'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(10,"JWT_SECRET must be at least 10 characters long"),
});

const envVars = envSchema.safeParse(process.env);   

if(!envVars.success) {
    console.error("Invalid environment variables:", envVars.error.format());
    process.exit(1);
}

export const env = envVars.data;