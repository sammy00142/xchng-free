import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { giftcardRouter } from "./routers/giftcard";
import { chatRouter } from "./routers/chat";
import { tradeRouter } from "./routers/trade";
import { mediaRouter } from "./routers/media";
import { adminChatRouter } from "./routers/admin-chat";
import { notificationRouter } from "./routers/notification";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  giftcard: giftcardRouter,
  chat: chatRouter,
  adminChat: adminChatRouter,
  trade: tradeRouter,
  media: mediaRouter,
  notification: notificationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
