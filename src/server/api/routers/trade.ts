import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { trade, message, TradeWithRelations } from "@/server/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { checkRole } from "@/lib/utils/role";

export const tradeRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        assetId: z.string().uuid(),
        amountInCurrency: z.string(),
        currency: z.enum(["NGN", "USD", "EUR", "GBP", "AUD", "CAD", "JPY"]),
        chatId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Ensure user can only create trades for themselves
        if (ctx.userId !== input.userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Can only create trades for yourself",
          });
        }

        const newTrade = await ctx.db
          .insert(trade)
          .values({
            userId: input.userId,
            assetId: input.assetId,
            amountInCurrency: input.amountInCurrency,
            currency: input.currency,
            status: "PENDING",
            chatId: input.chatId,
            updatedAt: new Date(),
          })
          .returning();

        return newTrade[0] ?? null;
      } catch (error) {
        console.error("[CREATE_TRADE_ERROR]", error);
        throw new Error("Failed to create trade");
      }
    }),

  getTradeById: protectedProcedure
    .input(z.object({ tradeId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const tradeData = await ctx.db.query.trade.findFirst({
        where: eq(trade.id, input.tradeId),
        with: {
          user: true,
          asset: true,
          chat: {
            with: {
              messages: {
                limit: 1,
                orderBy: [desc(message.createdAt)],
                with: {
                  sender: true,
                },
              },
            },
          },
        },
      });

      if (!tradeData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Trade not found",
        });
      }

      // Check authorization
      const isAdmin = await checkRole("admin");
      if (!isAdmin && tradeData.userId !== ctx.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized to view this trade",
        });
      }

      return tradeData;
    }),

  getTradeByChatId: protectedProcedure
    .input(z.object({ chatId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const tradeData = await ctx.db.query.trade.findFirst({
        where: eq(trade.chatId, input.chatId),
        with: {
          user: true,
          asset: true,
          chat: {
            with: {
              messages: {
                limit: 1,
                orderBy: [desc(message.createdAt)],
                with: {
                  sender: true,
                },
              },
            },
          },
        },
      });

      if (!tradeData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Trade not found for this chat",
        });
      }

      // Check authorization
      const isAdmin = await checkRole("admin");
      if (!isAdmin && tradeData.userId !== ctx.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized to view this trade",
        });
      }

      return (tradeData as TradeWithRelations) ?? null;
    }),

  updateTradeStatus: protectedProcedure
    .input(
      z.object({
        tradeId: z.string().uuid(),
        status: z.enum(["PENDING", "ACTIVE", "COMPLETED", "CANCELLED"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const isAdmin = await checkRole("admin");
      if (!isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only administrators can update trade status",
        });
      }

      const updatedTrade = await ctx.db
        .update(trade)
        .set({
          status: input.status,
          updatedAt: new Date(),
        })
        .where(eq(trade.id, input.tradeId))
        .returning();

      return updatedTrade[0];
    }),

  getTradeStats: protectedProcedure
    .input(z.object({}).optional())
    .query(async ({ ctx }) => {
      const isAdmin = await checkRole("admin");
      if (!isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only administrators can view trade statistics",
        });
      }

      const stats = await ctx.db
        .select({
          totalTrades: sql<number>`count(*)`,
          pendingTrades: sql<number>`sum(case when status = 'PENDING' then 1 else 0 end)`,
          activeTrades: sql<number>`sum(case when status = 'ACTIVE' then 1 else 0 end)`,
          completedTrades: sql<number>`sum(case when status = 'COMPLETED' then 1 else 0 end)`,
          cancelledTrades: sql<number>`sum(case when status = 'CANCELLED' then 1 else 0 end)`,
        })
        .from(trade);

      return stats[0];
    }),

  getAllTrades: protectedProcedure.query(async ({ ctx }) => {
    const isAdmin = await checkRole("admin");
    if (!isAdmin) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can view all trades",
      });
    }

    const trades = await ctx.db.query.trade.findMany({
      with: {
        user: true,
        asset: true,
        chat: true,
      },
      orderBy: [desc(trade.createdAt)],
    });

    return trades;
  }),

  getUserTrades: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not found",
      });
    }
    const trades = await ctx.db.query.trade.findMany({
      where: eq(trade.userId, ctx.userId),
      with: {
        asset: true,
      },
      orderBy: [desc(trade.createdAt)],
    });

    return trades;
  }),
});
