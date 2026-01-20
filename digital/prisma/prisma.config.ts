import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  datasource: {
    provider: "postgresql",
    url: process.env.DATABASE_URL,
  },
  migrations: {
    // Use `seed` to run your seed script
    seed: "npx tsx prisma/seed.ts",
  },
});
