import { media, MediaSelect } from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { eq } from "drizzle-orm";

export const mediaRouter = createTRPCRouter({
  upload: protectedProcedure
    .input(
      z.object({
        url: z.string(),
        fileName: z.string(),
        size: z.string(),
        messageId: z.string(),
        type: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId) {
        return { error: "Unauthorized: User not logged in" };
      }

      try {
        await ctx.db.insert(media).values({
          ownerId: ctx.userId,
          type: input.type,
          fileName: input.fileName,
          size: input.size,
          url: input.url,
          messageId: input.messageId,
        });
      } catch (error) {
        console.error("[UPLOAD_MEDIA_ERROR]", error);
      }
    }),
  getMediaByMessage: protectedProcedure
    .input(z.object({ messageId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return (await ctx.db.query.media.findMany({
        where: eq(media.messageId, input.messageId),
      })) as MediaSelect[];
    }),
});
