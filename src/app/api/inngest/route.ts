import { functions } from "@/server/inngest/functions";
import { inngest } from "@/server/inngest/client";
import { serve } from "inngest/next";

/**
 * Try to automatically choose the edge runtime if `INNGEST_STREAMING` is set.
 *
 * See https://innge.st/streaming.
 */

export const runtime =
  process.env.INNGEST_STREAMING?.toLowerCase() === "force" ? "edge" : "nodejs";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions,
});
