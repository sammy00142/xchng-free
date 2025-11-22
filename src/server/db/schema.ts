import {
  InferInsertModel,
  InferSelectModel,
  relations,
  sql,
} from "drizzle-orm";
import {
  boolean,
  decimal,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTableCreator,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { env } from "@/env";

export const createTable = pgTableCreator(
  (name) => `${env.NODE_ENV === "development" ? "dev_" : ""}greatex_${name}`
);

// Enum definitions
export const assetTypeEnum = pgEnum("asset_type", ["CRYPTO", "GIFTCARD"]);
export const tradeStatusEnum = pgEnum("trade_status", [
  "PENDING",
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
]);
export const currencyEnum = pgEnum("currency_type", [
  "NGN",
  "USD",
  "EUR",
  "GBP",
  "AUD",
  "CAD",
  "JPY",
]);
export const chatTypeEnum = pgEnum("chat_type", [
  "TRADE",
  "SUPPORT",
  "GENERAL",
]);
export const messageTypeEnum = pgEnum("message_type", ["STANDARD", "CARD"]);
export const messageStatusEnum = pgEnum("message_status", [
  "SEEN",
  "SENT",
  "NOT_SENT",
]);
export const messageContentTypeEnum = pgEnum("message_content_type", [
  "MEDIA",
  "CARD",
  "TEXT",
]);
export const lastMessageSenderEnum = pgEnum("last_message_sender", [
  "USER",
  "ADMIN",
]);

// =========================================
// Base Columns Type (for consistency)
// =========================================
const baseColumns = {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deleted: boolean("deleted").notNull().default(false),
  deletedAt: timestamp("deleted_at"),
  deletedBy: varchar("deleted_by"),
};

// =========================================
// Core Tables
// =========================================
export const user = createTable(
  "user",
  {
    ...baseColumns,
    id: varchar("id").primaryKey().notNull(),
    username: varchar("username", { length: 255 }).unique(),
    firstName: varchar("first_name", { length: 255 }),
    lastName: varchar("last_name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull().unique(),
    emailVerified: boolean("email_verified").notNull().default(false),
    imageUrl: varchar("image_url", { length: 255 }),
    profileImageUrl: varchar("profile_image_url", { length: 255 }),
    birthday: timestamp("birthday"),
    gender: varchar("gender", { length: 50 }),
    passwordEnabled: boolean("password_enabled").notNull().default(true),
    twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),
    externalId: varchar("external_id", { length: 255 }),
    lastSignInAt: timestamp("last_sign_in_at"),
    disabled: boolean("disabled").notNull().default(false),
    metadata: jsonb("metadata"),
  },
  (table) => ({
    emailIdx: index("user_email_idx").on(table.email),
    usernameIdx: index("user_username_idx").on(table.username),
    externalIdIdx: index("user_external_id_idx").on(table.externalId),
    nameSearchIdx: index("user_name_search_idx").on(
      table.firstName,
      table.lastName
    ),
    activeUsersIdx: index("active_users_idx")
      .on(table.lastSignInAt)
      .where(sql`disabled = false AND deleted = false`),
  })
);

export const asset = createTable(
  "asset",
  {
    ...baseColumns,
    type: assetTypeEnum("type").notNull(),
    name: varchar("name").notNull(),
    coverImage: varchar("cover_image"),
    description: varchar("description"),
    quote: varchar("quote"),
    category: varchar("category"),
    featured: boolean("featured").notNull().default(false),
    popular: boolean("popular").notNull().default(false),
    tradeCount: integer("trade_count").notNull().default(0),
    minTradeAmount: decimal("min_trade_amount", { precision: 18, scale: 2 }),
    maxTradeAmount: decimal("max_trade_amount", { precision: 18, scale: 2 }),
    metadata: jsonb("metadata"),
  },
  (table) => ({
    typeIdx: index("asset_type_idx").on(table.type),
    nameIdx: index("asset_name_idx").on(table.name),
    popularAssetsIdx: index("popular_assets_idx").on(table.tradeCount.desc()),
  })
);

export const trade = createTable(
  "trade",
  {
    ...baseColumns,
    userId: varchar("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    assetId: uuid("asset_id")
      .notNull()
      .references(() => asset.id, { onDelete: "cascade" }),
    chatId: uuid("chat_id")
      .notNull()
      .references(() => chat.id, { onDelete: "cascade" }),
    currency: currencyEnum("currency").notNull().default("USD"),
    status: tradeStatusEnum("status").notNull(),
    amountInCurrency: decimal("amount_in_currency", {
      precision: 18,
      scale: 2,
    }),
    amountInNGN: decimal("amount_in_ngn", { precision: 18, scale: 2 }),
    metadata: jsonb("metadata"),
  },
  (table) => ({
    userIdIdx: index("trade_user_id_idx").on(table.userId),
    assetIdIdx: index("trade_asset_id_idx").on(table.assetId),
    statusIdx: index("trade_status_idx").on(table.status),
    userStatusIdx: index("trade_user_status_idx").on(
      table.userId,
      table.status
    ),
    amountIdx: index("trade_amount_idx").on(table.amountInCurrency),
    userTimeIdx: index("trade_user_time_idx").on(table.userId, table.createdAt),
    activeTradesIdx: index("active_trades_idx")
      .on(table.status, table.createdAt)
      .where(sql`status = 'ACTIVE'`),
  })
);

export const chat = createTable(
  "chat",
  {
    ...baseColumns,
    userId: varchar("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    assetId: uuid("asset_id").references(() => asset.id, {
      onDelete: "set null",
    }),
    type: chatTypeEnum("type").notNull(),
    lastMessageId: uuid("last_message_id"),
    lastMessageText: varchar("last_message_text"),
    lastMessageTime: timestamp("last_message_time"),
    lastMessageSenderId: varchar("last_message_sender_id"),
    lastMessageStatus: messageStatusEnum("last_message_status")
      .notNull()
      .default("SENT"),
    lastMessageContentType: messageContentTypeEnum("last_message_content_type"),
    lastMessageSender: lastMessageSenderEnum("last_message_sender"),
    participantCount: integer("participant_count").notNull().default(0),
  },
  (table) => ({
    userIdIdx: index("chat_user_id_idx").on(table.userId),
    assetIdIdx: index("chat_asset_id_idx").on(table.assetId),
    lastMessageTimeIdx: index("chat_last_message_time_idx").on(
      table.lastMessageTime
    ),
    typeIdx: index("chat_type_idx").on(table.type),
  })
);

export const pushSubscriptions = createTable("push_subscriptions", {
  ...baseColumns,
  userId: varchar("user_id")
    .notNull()
    .references(() => user.id),
  endpoint: varchar("endpoint").notNull(),
  auth: varchar("auth").notNull(),
  p256dh: varchar("p256dh").notNull(),
  expirationTime: timestamp("expiration_time"),
});

export const notificationPreferences = createTable("notification_preferences", {
  ...baseColumns,
  userId: varchar("user_id")
    .notNull()
    .references(() => user.id),
  preferences: jsonb("preferences")
    .notNull()
    .$type<NotificationPreferencesType>(),
  isSubscribed: boolean("is_subscribed").notNull().default(false),
});

export const message = createTable(
  "message",
  {
    ...baseColumns,
    chatId: uuid("chat_id")
      .notNull()
      .references(() => chat.id, { onDelete: "cascade" }),
    text: varchar("text").notNull(),
    type: messageTypeEnum("type").notNull().default("STANDARD"),
    senderId: varchar("sender_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    parentId: uuid("parent_id").references((): any => message.id),
    threadRoot: uuid("thread_root").references((): any => message.id),
    isAdmin: boolean("is_admin").notNull().default(false),
    status: messageStatusEnum("status").notNull().default("SENT"),
    contentType: messageContentTypeEnum("content_type")
      .notNull()
      .default("TEXT"),
    metadata: jsonb("metadata"),
    mediaUrl: varchar("media_url"),
  },
  (table) => ({
    chatIdIdx: index("message_chat_id_idx").on(table.chatId),
    senderIdIdx: index("message_sender_id_idx").on(table.senderId),
    threadRootIdx: index("message_thread_root_idx").on(table.threadRoot),
    chatTimeIdx: index("message_chat_time_idx").on(
      table.chatId,
      table.createdAt
    ),
  })
);

export const media = createTable(
  "media",
  {
    ...baseColumns,
    ownerId: varchar("owner_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    messageId: uuid("message_id").references(() => message.id, {
      onDelete: "cascade",
    }),
    url: varchar("url").notNull(),
    type: varchar("type", { length: 50 }).notNull(),
    fileName: varchar("file_name").notNull(),
    size: decimal("size", { precision: 10, scale: 0 }).notNull(),
    mimeType: varchar("mime_type", { length: 100 }),
    metadata: jsonb("metadata"),
  },
  (table) => ({
    ownerIdIdx: index("media_owner_id_idx").on(table.ownerId),
    typeIdx: index("media_type_idx").on(table.type),
    ownerTypeIdx: index("media_owner_type_idx").on(table.ownerId, table.type),
  })
);

// =========================================
// Audit and History Tables
// =========================================
export const auditLog = createTable("audit_log", {
  ...baseColumns,
  entityType: varchar("entity_type").notNull(),
  entityId: uuid("entity_id").notNull(),
  action: varchar("action").notNull(),
  userId: varchar("user_id").notNull(),
  changes: jsonb("changes"),
  ipAddress: varchar("ip_address"),
  userAgent: varchar("user_agent"),
});

export const tradeStatusHistory = createTable("trade_status_history", {
  ...baseColumns,
  tradeId: uuid("trade_id")
    .notNull()
    .references(() => trade.id, { onDelete: "cascade" }),
  oldStatus: tradeStatusEnum("old_status"),
  newStatus: tradeStatusEnum("new_status").notNull(),
  changedBy: varchar("changed_by")
    .notNull()
    .references(() => user.id),
  reason: varchar("reason"),
  metadata: jsonb("metadata"),
});

// =========================================
// Rate Limiting and System Tables
// =========================================
export const rateLimit = createTable("rate_limit", {
  ...baseColumns,
  userId: varchar("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  action: varchar("action").notNull(),
  count: integer("count").notNull().default(0),
  window: timestamp("window").notNull(),
  ipAddress: varchar("ip_address"),
});

// =========================================
// Relations
// =========================================
export const userRelations = relations(user, ({ many, one }) => ({
  chats: many(chat),
  trades: many(trade),
  messages: many(message),
  media: many(media),
  pushSubscriptions: many(pushSubscriptions),
  notificationPreferences: one(notificationPreferences, {
    fields: [user.id],
    references: [notificationPreferences.userId],
  }),
}));

export const assetRelations = relations(asset, ({ many }) => ({
  trades: many(trade),
  chats: many(chat),
}));

export const tradeRelations = relations(trade, ({ one }) => ({
  user: one(user, { fields: [trade.userId], references: [user.id] }),
  asset: one(asset, { fields: [trade.assetId], references: [asset.id] }),
  chat: one(chat, { fields: [trade.chatId], references: [chat.id] }),
}));

export const chatRelations = relations(chat, ({ one, many }) => ({
  user: one(user, { fields: [chat.userId], references: [user.id] }),
  asset: one(asset, { fields: [chat.assetId], references: [asset.id] }),
  messages: many(message),
  trade: one(trade, {
    fields: [chat.id],
    references: [trade.chatId],
  }),
}));

export const messageRelations = relations(message, ({ one, many }) => ({
  chat: one(chat, { fields: [message.chatId], references: [chat.id] }),
  sender: one(user, { fields: [message.senderId], references: [user.id] }),
  parent: one(message, {
    fields: [message.parentId],
    references: [message.id],
  }),
  thread: one(message, {
    fields: [message.threadRoot],
    references: [message.id],
  }),
  media: many(media),
}));

export const mediaRelations = relations(media, ({ one }) => ({
  owner: one(user, { fields: [media.ownerId], references: [user.id] }),
  message: one(message, {
    fields: [media.messageId],
    references: [message.id],
  }),
}));

// =========================================
// Types
// =========================================
// User Types
export type UserSelect = InferSelectModel<typeof user>;
export type UserInsert = InferInsertModel<typeof user>;

// Asset Types
export type AssetSelect = InferSelectModel<typeof asset>;
export type AssetInsert = InferInsertModel<typeof asset>;

// Trade Types
export type TradeSelect = InferSelectModel<typeof trade>;
export type TradeInsert = InferInsertModel<typeof trade>;

// Chat Types
export type ChatSelect = InferSelectModel<typeof chat>;
export type ChatInsert = InferInsertModel<typeof chat>;

// Message Types
export type MessageSelect = InferSelectModel<typeof message>;
export type MessageInsert = InferInsertModel<typeof message>;

// Media Types
export type MediaSelect = InferSelectModel<typeof media>;
export type MediaInsert = InferInsertModel<typeof media>;

// Enum Types
export type AssetType = (typeof assetTypeEnum.enumValues)[number];
export type TradeStatus = (typeof tradeStatusEnum.enumValues)[number];
export type ChatType = (typeof chatTypeEnum.enumValues)[number];

// Extended Types with Relations
export type UserWithRelations = UserSelect & {
  chats?: ChatSelect[];
  trades?: TradeSelect[];
  messages?: MessageSelect[];
  media?: MediaSelect[];
};

export type ChatWithRelations = ChatSelect & {
  messages?: MessageSelect[];
  media?: MediaSelect[];
  user?: UserSelect;
  asset?: AssetSelect;
  trade?: TradeSelect & {
    asset?: AssetSelect;
  };
};

export type MessageWithRelations = MessageSelect & {
  media?: MediaSelect[];
  user?: UserSelect;
  chat?: ChatSelect;
};

export type TradeWithRelations = TradeSelect & {
  user?: UserSelect;
  asset?: AssetSelect;
  chat?: ChatSelect;
};

export type MediaWithRelations = MediaSelect & {
  user?: UserSelect;
};

// Utility types for partial inserts/updates
export type PartialUserInsert = Partial<UserInsert>;
export type PartialAssetInsert = Partial<AssetInsert>;
export type PartialTradeInsert = Partial<TradeInsert>;
export type PartialChatInsert = Partial<ChatInsert>;
export type PartialMessageInsert = Partial<MessageInsert>;
export type PartialMediaInsert = Partial<MediaInsert>;

// Types for search/filter parameters
export type UserSearchParams = {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  externalId?: string;
};

export type AssetSearchParams = {
  type?: AssetType;
  name?: string;
  category?: string;
};

export type TradeSearchParams = {
  userId?: string;
  assetId?: string;
  status?: TradeStatus;
  minAmount?: number;
  maxAmount?: number;
  dateFrom?: Date;
  dateTo?: Date;
};

export type ChatSearchParams = {
  userId?: string;
  type?: ChatType;
  assetId?: string;
};

export type MessageSearchParams = {
  chatId?: string;
  userId?: string;
  type?: string;
  dateFrom?: Date;
  dateTo?: Date;
  includeDeleted?: boolean;
};

export type MediaSearchParams = {
  ownerId?: string;
  type?: string;
  fileName?: string;
};

// Add this near the other type definitions
export type NotificationPreferencesType = Record<string, boolean>;

// Add these to your existing type exports
export type NotificationPreferencesSelect = InferSelectModel<
  typeof notificationPreferences
>;
export type NotificationPreferencesInsert = InferInsertModel<
  typeof notificationPreferences
>;
