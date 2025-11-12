/**
 * Environment variable type definitions
 */

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /**
       * USDA FoodData Central API key
       * Get a free key at https://fdc.nal.usda.gov/api-key-signup.html
       */
      FDC_API_KEY: string;

      // Next.js default env vars
      NODE_ENV: "development" | "production" | "test";
      NEXT_PUBLIC_VERCEL_URL?: string;
    }
  }
}

export {};
