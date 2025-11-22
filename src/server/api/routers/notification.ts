import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  notificationPreferences,
  NotificationPreferencesSelect,
  pushSubscriptions,
  user,
} from "@/server/db/schema";
import { eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import * as webpush from "web-push";
import { env } from "@/env";
import { v4 } from "uuid";

const vapidDetails = {
  subject: "mailto:djayableez@gmail.com",
  privateKey: env.VAPID_PRIVATE_KEY,
  publicKey: env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
};

export const notificationRouter = createTRPCRouter({
  getNotificationPreferences: protectedProcedure.query(async ({ ctx }) => {
    try {
      if (!ctx.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to get notification preferences",
        });
      }

      const preferences = await ctx.db.query.notificationPreferences.findFirst({
        where: eq(notificationPreferences.userId, ctx.userId),
      });

      return (
        preferences ??
        ({
          preferences: {
            message: true,
            updates: true,
            reminders: true,
            account: true,
          },
          isSubscribed: false,
          userId: ctx.userId,
          id: v4(),
          deleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          deletedBy: null,
        } as NotificationPreferencesSelect)
      );
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get notification preferences",
      });
    }
  }),

  subscribeToNotifications: protectedProcedure
    .input(
      z.object({
        subscription: z.object({
          endpoint: z.string(),
          expirationTime: z.date().optional(),
          auth: z.string(),
          p256dh: z.string(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      try {
        if (!userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to subscribe to notifications",
          });
        }

        const existingSubscription =
          await ctx.db.query.pushSubscriptions.findFirst({
            where: eq(pushSubscriptions.endpoint, input.subscription.endpoint),
          });

        if (existingSubscription) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Subscription already exists",
          });
        }

        const newSubscription = await ctx.db
          .insert(pushSubscriptions)
          .values({
            userId: userId,
            endpoint: input.subscription.endpoint,
            auth: input.subscription.auth,
            p256dh: input.subscription.p256dh,
            expirationTime: input.subscription.expirationTime,
          })
          .returning();

        const existingPreferences =
          await ctx.db.query.notificationPreferences.findFirst({
            where: eq(notificationPreferences.userId, userId),
          });

        if (!existingPreferences) {
          await ctx.db.insert(notificationPreferences).values({
            userId: userId,
            isSubscribed: true,
            preferences: {
              message: true,
              updates: true,
              reminders: true,
              account: true,
            },
          });
        } else {
          await ctx.db
            .update(notificationPreferences)
            .set({ isSubscribed: true })
            .where(eq(notificationPreferences.userId, userId));
        }

        return newSubscription;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to subscribe to notifications",
        });
      }
    }),

  unsubscribeFromNotifications: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      if (!ctx.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to unsubscribe from notifications",
        });
      }

      await ctx.db
        .delete(pushSubscriptions)
        .where(eq(pushSubscriptions.userId, ctx.userId));

      await ctx.db
        .update(notificationPreferences)
        .set({ isSubscribed: false })
        .where(eq(notificationPreferences.userId, ctx.userId));

      return { success: true };
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to unsubscribe from notifications",
      });
    }
  }),

  updateNotificationPreferences: protectedProcedure
    .input(
      z.object({
        preferences: z.any(),
        isSubscribed: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to update notification preferences",
          });
        }

        await ctx.db
          .update(notificationPreferences)
          .set({
            preferences: input.preferences,
            isSubscribed: input.isSubscribed,
          })
          .where(eq(notificationPreferences.userId, ctx.userId));

        return { success: true };
      } catch (error) {
        console.error(error);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update notification preferences",
        });
      }
    }),

  sendNotificationToAdmin: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        body: z.string(),
        url: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to send a notification to admins",
          });
        }

        const admins = await ctx.db.query.user.findMany({
          where: sql`${user.metadata}->>'role' = 'admin'`,
        });

        if (admins.length === 0) {
          console.error({ success: false, error: "No admins found" });
          return { success: false, error: "No admins found" };
        }

        const adminIds = admins.map((admin) => admin.id);

        const adminSubscriptions =
          await ctx.db.query.pushSubscriptions.findMany({
            where: inArray(pushSubscriptions.userId, adminIds),
          });

        // Send notification to each admin subscription
        await Promise.all(
          adminSubscriptions.map((subscriptionData) => {
            const subscription = {
              endpoint: subscriptionData.endpoint,
              keys: {
                auth: subscriptionData.auth,
                p256dh: subscriptionData.p256dh,
              },
              expirationTime: subscriptionData.expirationTime,
            } as unknown as webpush.PushSubscription;

            return webpush.sendNotification(
              subscription,
              JSON.stringify(input),
              {
                vapidDetails,
              }
            );
          })
        );

        return { success: true };
      } catch (error) {
        console.error(error);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send notification to admins",
        });
      }
    }),

  sendNotificationToUser: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        payload: z.object({
          title: z.string(),
          body: z.string(),
          url: z.string(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to send a notification to a user",
          });
        }

        const data = await ctx.db.query.pushSubscriptions.findFirst({
          where: eq(pushSubscriptions.userId, input.userId),
        });

        if (!data) {
          console.error("No subscription found for user");
          return { success: false };
        }

        const subscription = {
          endpoint: data?.endpoint,
          keys: {
            auth: data?.auth,
            p256dh: data?.p256dh,
          },
          expirationTime: data?.expirationTime,
        } as unknown as webpush.PushSubscription;

        if (!subscription) {
          console.error("No subscription found for user");
          return { success: false };
        }

        await webpush.sendNotification(
          subscription,
          JSON.stringify(input.payload),
          {
            vapidDetails,
          }
        );

        return { success: true };
      } catch (error) {
        console.error(error);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send notification to user",
        });
      }
    }),

  getNotificationStatus: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not found",
      });
    }

    const subscription = await ctx.db
      .select()
      .from(pushSubscriptions)
      .where(eq(pushSubscriptions.userId, ctx.userId));

    const preferences = await ctx.db
      .select()
      .from(notificationPreferences)
      .where(eq(notificationPreferences.userId, ctx.userId));

    return {
      isSubscribed: subscription.length > 0,
      preferences: preferences[0],
    };
  }),
});
