import { type Config } from "drizzle-kit";

import { env } from "@/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  out: "./src/lib/drizzle",
  tablesFilter: [`${env.NODE_ENV === "development" ? "dev_" : ""}greatex_*`],
} satisfies Config;
