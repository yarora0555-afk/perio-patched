import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// `vercel env pull` writes `.env.local`; plain dotenv loading also supports `.env`.
config({ path: ".env.local" });
config();

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is required to run Drizzle migrations.");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url },
});
