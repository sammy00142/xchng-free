import { asset } from "@/server/db/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { eq } from "drizzle-orm";

const GiftcardSchema = z.object({
  id: z.string(),
  type: z.enum(["GIFTCARD", "CRYPTO"]),
  name: z.string(),
  coverImage: z.string(),
  description: z.null(),
  quote: z.string(),
  category: z.string(),
});
export type Giftcard = z.infer<typeof GiftcardSchema>;

export const giftcardRouter = createTRPCRouter({
  create: publicProcedure
    .input(GiftcardSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.insert(asset).values({
          category: input.category,
          type: input.type,
          name: input.name,
          coverImage: input.coverImage,
          description: input.description,
          quote: input.quote,
          id: input.id,
        });
      } catch (error) {
        console.error("[INTERNAL_ERROR]", error);
        throw new Error("Failed to create user");
      }
    }),

  getAllCards: publicProcedure.query(async ({ ctx }) => {
    try {
      const cards = await ctx.db
        .select()
        .from(asset)
        .where(eq(asset.type, "GIFTCARD"));

      return cards;
    } catch (error) {
      console.error("[GET_ALL_CARDS_ERROR]", error);
      return null;
    }
  }),

  getCardInfo: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        const card = await ctx.db
          .select()
          .from(asset)
          .where(eq(asset.id, input.id));

          return card[0]
      } catch (error) {
        console.error(`[GET_${input.id}_CARD_INFO_ERROR]`, error);
        return null
      }
    }),
});
