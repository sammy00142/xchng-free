import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  chat,
  message,
  media,
  ChatWithRelations,
  user,
  asset,
} from "@/server/db/schema";
import { eq, desc, and, sql, or, asc } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { v4 } from "uuid";
import { TRPCError } from "@trpc/server";
import { checkRole } from "@/lib/utils/role";
import { api } from "@/trpc/server";

// Input validation schemas
const ChatSchema = z.object({
  id: z.string().uuid().optional(),
  type: z.enum(["TRADE", "SUPPORT", "GENERAL"]),
  userId: z.string(),
  assetId: z.string().uuid().optional(),
  chatId: z.string().uuid().optional(),
  tradeId: z.string().uuid().optional(),
  lastMessageId: z.string().uuid().optional(),
  currency: z
    .enum(["NGN", "USD", "EUR", "GBP", "AUD", "CAD", "JPY"])
    .optional(),
  amount: z.number().optional(),
});

export const chatRouter = createTRPCRouter({
  getChat: protectedProcedure
    .input(z.object({ chatId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const chatData = await ctx.db.query.chat.findFirst({
        where: eq(chat.id, input.chatId),
        with: {
          messages: {
            orderBy: [asc(message.createdAt)],
            limit: 50,
            with: {
              media: true,
              sender: true,
            },
          },
          user: true,
          asset: true,
          trade: {
            with: {
              asset: true,
            },
          },
        },
      });

      if (!chatData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chat not found",
        });
      }

      const isAdmin = await checkRole("admin");
      if (!isAdmin && chatData.userId !== ctx.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized to view this chat",
        });
      }

      return chatData as ChatWithRelations;
    }),
  getChatsByUserId: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().uuid().optional(),
        type: z.enum(["TRADE", "SUPPORT", "GENERAL"]).optional(),
        searchQuery: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not found",
        });
      }

      const chats = await ctx.db.query.chat.findMany({
        where: and(
          eq(chat.userId, ctx.userId),
          eq(chat.deleted, false),
          input.type ? eq(chat.type, input.type) : undefined,
          input.searchQuery
            ? or(
                sql`${chat.lastMessageText} ILIKE ${`%${input.searchQuery}%`}`,
                sql`${user.firstName} ILIKE ${`%${input.searchQuery}%`}`,
                sql`${user.lastName} ILIKE ${`%${input.searchQuery}%`}`,
                sql`${user.username} ILIKE ${`%${input.searchQuery}%`}`,
                sql`${asset.name} ILIKE ${`%${input.searchQuery}%`}`
              )
            : undefined,
          input.cursor
            ? sql`${chat.lastMessageTime} < (SELECT last_message_time FROM ${chat} WHERE id = ${input.cursor})`
            : undefined
        ),
        orderBy: [desc(chat.lastMessageTime), desc(chat.createdAt)],
        limit: input.limit,
        with: {
          user: true,
          asset: true,
          trade: {
            with: {
              asset: true,
            },
          },
          messages: {
            limit: 1,
            orderBy: [desc(message.createdAt)],
            with: {
              sender: true,
            },
          },
        },
      });

      const nextCursor = chats[chats.length - 1]?.id;

      return {
        items: chats as ChatWithRelations[],
        nextCursor,
      };
    }),

  markAsSeen: protectedProcedure
    .input(
      z.object({
        chatId: z.string().uuid(),
        messageIds: z.array(z.string().uuid()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(chat)
        .set({ lastMessageStatus: "SEEN" })
        .where(
          and(eq(chat.id, input.chatId), eq(chat.lastMessageStatus, "SENT"))
        );

      if (input.messageIds.length === 0) return;

      const messagesIds = input.messageIds.join(",");

      await ctx.db
        .update(message)
        .set({ status: "SEEN" })
        .where(
          and(
            eq(message.chatId, input.chatId),
            sql`id = ANY(${messagesIds})`,
            eq(message.isAdmin, true)
          )
        );
    }),

  listChats: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(500).default(100),
        cursor: z.string().uuid().optional(),
        userId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.userId) return null;
      const chats = await ctx.db.query.chat.findMany({
        where: and(
          eq(chat.userId, ctx.userId),
          eq(chat.deleted, false),
          input.cursor
            ? sql`${chat.createdAt} < (SELECT created_at FROM ${chat} WHERE id = ${input.cursor})`
            : undefined
        ),
        orderBy: [desc(chat.lastMessageTime), desc(chat.createdAt)],
        limit: input.limit,
        with: {
          asset: true,
          trade: true,
          user: true,
        },
      });

      const nextCursor = chats[chats.length - 1]?.id;

      return {
        items: chats,
        nextCursor,
      };
    }),

  getMessages: protectedProcedure
    .input(
      z.object({
        chatId: z.string().uuid(),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().uuid().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const messages = await ctx.db.query.message.findMany({
        where: and(
          eq(message.chatId, input.chatId),
          eq(message.deleted, false),
          input.cursor
            ? sql`${message.createdAt} < (SELECT created_at FROM ${message} WHERE id = ${input.cursor})`
            : undefined
        ),
        orderBy: [asc(message.createdAt)],
        limit: input.limit,
        with: {
          sender: true,
          media: true,
          parent: {
            with: {
              sender: true,
            },
          },
        },
      });

      const nextCursor = messages[messages.length - 1]?.id;

      return {
        items: messages,
        nextCursor,
      };
    }),

  sendMessage: protectedProcedure
    .input(
      z.object({
        chatId: z.string().uuid(),
        text: z.string(),
        type: z.enum(["STANDARD", "CARD"]).optional(),
        contentType: z.enum(["MEDIA", "TEXT", "CARD"]).optional(),
        mediaId: z.string().optional(),
        isAdmin: z.boolean().optional(),
        replyToId: z.string().uuid().optional().nullable(),
        messageId: z.string().uuid(),
        mediaFileName: z.string().optional(),
        mediaSize: z.string().optional(),
        mediaType: z.string().optional(),
        mediaUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const chatData = await ctx.db.query.chat.findFirst({
          where: eq(chat.id, input.chatId),
        });

        if (!chatData || chatData.userId !== ctx.userId || chatData.deleted) {
          throw new Error("Chat not found or unauthorized");
        }

        const newMessage = await ctx.db
          .insert(message)
          .values({
            id: input.messageId,
            chatId: input.chatId,
            text: input.text,
            type: input.type || "STANDARD",
            isAdmin: checkRole("admin"),
            senderId: ctx.userId,
            parentId: input.replyToId,
            threadRoot: input.replyToId,
            contentType: input.mediaUrl ? "MEDIA" : "TEXT",
            status: "SENT",
            mediaUrl: input.mediaUrl ?? null,
          })
          .returning();

        await ctx.db
          .update(chat)
          .set({
            updatedAt: new Date(),
            lastMessageId: input.messageId,
            lastMessageText: input.text,
            lastMessageTime: new Date(),
            lastMessageSenderId: ctx.userId,
            lastMessageStatus: "SENT",
            lastMessageContentType: input.contentType,
          })
          .where(eq(chat.id, input.chatId));

        if (input.mediaUrl) {
          await ctx.db.insert(media).values({
            ownerId: ctx.userId,
            type: input.mediaType ?? "image/png",
            fileName: input.mediaFileName ?? v4(),
            size: input.mediaSize ?? "2048",
            url: input.mediaUrl,
            messageId: input.messageId,
          });
        }

        return newMessage[0];
      } catch (error) {
        console.error("[SEND_MESSAGE_ERROR]", error);
        throw new Error("Failed to send message");
      }
    }),

  deleteMessage: protectedProcedure
    .input(z.object({ messageId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const messageData = await ctx.db.query.message.findFirst({
        where: eq(message.id, input.messageId),
      });

      if (!messageData || messageData.senderId !== ctx.userId) {
        throw new Error("Message not found or unauthorized");
      }

      await ctx.db
        .update(message)
        .set({
          deleted: true,
          deletedAt: new Date(),
          deletedBy: ctx.userId,
        })
        .where(eq(message.id, input.messageId));

      return { success: true };
    }),

  markMessagesSeen: protectedProcedure
    .input(
      z.object({
        chatId: z.string().uuid(),
        messageIds: z.array(z.string().uuid()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await currentUser();
      const isAdmin = user?.publicMetadata?.role === "admin";

      // Get messages that need to be marked as seen
      const messages = await ctx.db.query.message.findMany({
        where: and(
          eq(message.chatId, input.chatId),
          eq(message.status, "SENT"),
          isAdmin
            ? eq(message.isAdmin, true) // Admin can only mark admin messages
            : and(
                eq(message.isAdmin, false), // Users can only mark non-admin messages
                sql`${message.senderId} != ${ctx.userId}` // Can't mark own messages as seen
              )
        ),
      });

      if (messages.length === 0) return { success: true };

      // Update message status
      await ctx.db
        .update(message)
        .set({
          status: "SEEN",
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(message.chatId, input.chatId),
            eq(message.status, "SENT"),
            sql`id = ANY(${input.messageIds})`
          )
        );

      return { success: true };
    }),

  getAllChats: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().uuid().optional(),
        type: z.enum(["TRADE", "SUPPORT", "GENERAL"]).optional(),
        searchQuery: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!checkRole("admin")) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only administrators can access all chats",
        });
      }

      const chats = await ctx.db.query.chat.findMany({
        where: and(
          eq(chat.deleted, false),
          input.type ? eq(chat.type, input.type) : undefined,
          input.searchQuery
            ? or(sql`${chat.lastMessageText} ILIKE ${`%${input.searchQuery}%`}`)
            : undefined,
          input.cursor
            ? sql`${chat.lastMessageTime} < (SELECT last_message_time FROM ${chat} WHERE id = ${input.cursor})`
            : undefined
        ),
        orderBy: [desc(chat.lastMessageTime), desc(chat.createdAt)],
        limit: input.limit,
        with: {
          user: true,
          asset: true,
          trade: {
            with: {
              asset: true,
            },
          },
          messages: {
            limit: 1,
            orderBy: [desc(message.createdAt)],
            with: {
              sender: true,
            },
          },
        },
      });

      const nextCursor = chats[chats.length - 1]?.id;

      return {
        items: chats,
        nextCursor,
      };
    }),

  getAdminChatStats: protectedProcedure
    .input(z.object({}).optional())
    .query(async ({ ctx }) => {
      if (!checkRole("admin")) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only administrators can access chat statistics",
        });
      }

      // Get basic chat stats
      const chatStats = await ctx.db
        .select({
          totalChats: sql<number>`count(*)`,
          activeChats: sql<number>`sum(case when ${chat.deleted} = false then 1 else 0 end)`,
        })
        .from(chat);

      // Get message count separately
      const messageStats = await ctx.db
        .select({
          totalMessages: sql<number>`count(*)`,
        })
        .from(message)
        .where(eq(message.deleted, false));

      // Get chat type distribution
      const chatTypeStats = await ctx.db
        .select({
          type: chat.type,
          count: sql<number>`count(*)`,
        })
        .from(chat)
        .groupBy(chat.type);

      // Combine all stats
      return {
        ...chatStats[0],
        totalMessages: messageStats[0]?.totalMessages,
        chatsByType: Object.fromEntries(
          chatTypeStats.map((stat) => [stat.type, stat.count])
        ),
      };
    }),

  // Create new chat
  create: protectedProcedure
    .input(ChatSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Ensure user can only create chats for themselves
        if (ctx.userId !== input.userId) {
          throw new Error("Unauthorized: Can only create chats for yourself");
        }

        const newChat = await ctx.db
          .insert(chat)
          .values({
            id: input.id,
            userId: input.userId,
            assetId: input.assetId,
            type: input.type ?? "TRADE",
          })
          .returning();

        if (!newChat[0]) {
          return { error: "Unable to start chat", data: null };
        }

        return { data: newChat[0], error: null };
      } catch (error) {
        console.error("[CREATE_CHAT_ERROR]", error);
        throw new Error("Failed to create chat");
      }
    }),

  delete: protectedProcedure
    .input(
      z.object({
        chatId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!checkRole("admin")) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only administrators can delete chats",
        });
      }

      await ctx.db
        .update(chat)
        .set({
          deleted: true,
          deletedAt: new Date(),
          deletedBy: ctx.userId,
        })
        .where(eq(chat.id, input.chatId));

      return { success: true };
    }),

  update: protectedProcedure
    .input(
      z.object({
        chatId: z.string().uuid(),
        type: z.enum(["TRADE", "SUPPORT", "GENERAL"]).optional(),
        metadata: z.record(z.any()).optional(),
        // Add any other fields that should be updatable
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!checkRole("admin")) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only administrators can update chats",
        });
      }

      const updateData: Partial<typeof chat.$inferInsert> = {
        updatedAt: new Date(),
      };

      if (input.type) {
        updateData.type = input.type;
      }

      const updatedChat = await ctx.db
        .update(chat)
        .set(updateData)
        .where(eq(chat.id, input.chatId))
        .returning();

      return updatedChat[0];
    }),
});
