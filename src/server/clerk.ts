import { env } from "@/env";
import { createClerkClient } from "@clerk/nextjs/server";


export const clerkClient = createClerkClient({
  secretKey: env.CLERK_SECRET_KEY,
});

