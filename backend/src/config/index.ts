import { z } from 'zod/v4';

const envSchema = z.object({
  MONGO_URI: z.url({ protocol: /mongodb/ }),
  DB_NAME: z.string(),
  CLIENT_BASE_URL: z.url().default('http://localhost:5173'),
  OPENAI_API_KEY: z.string(),
  OPENAI_MODEL: z.string()
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:\n', z.prettifyError(parsedEnv.error));
  process.exit(1);
}

export const { MONGO_URI, DB_NAME, CLIENT_BASE_URL, OPENAI_API_KEY, OPENAI_MODEL } = parsedEnv.data;
