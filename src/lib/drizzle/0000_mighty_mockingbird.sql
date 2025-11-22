DO $$ BEGIN
 CREATE TYPE "public"."asset_type" AS ENUM('CRYPTO', 'GIFTCARD');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."chat_type" AS ENUM('TRADE', 'SUPPORT', 'GENERAL');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."currency_type" AS ENUM('NGN', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."last_message_sender" AS ENUM('USER', 'ADMIN');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."message_content_type" AS ENUM('MEDIA', 'CARD', 'TEXT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."message_status" AS ENUM('SEEN', 'SENT', 'NOT_SENT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."message_type" AS ENUM('STANDARD', 'CARD');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."trade_status" AS ENUM('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dev_greatex_asset" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp,
	"deleted_by" varchar,
	"type" "asset_type" NOT NULL,
	"name" varchar NOT NULL,
	"cover_image" varchar,
	"description" varchar,
	"quote" varchar,
	"category" varchar,
	"featured" boolean DEFAULT false NOT NULL,
	"popular" boolean DEFAULT false NOT NULL,
	"trade_count" integer DEFAULT 0 NOT NULL,
	"min_trade_amount" numeric(18, 2),
	"max_trade_amount" numeric(18, 2),
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dev_greatex_audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp,
	"deleted_by" varchar,
	"entity_type" varchar NOT NULL,
	"entity_id" uuid NOT NULL,
	"action" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"changes" jsonb,
	"ip_address" varchar,
	"user_agent" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dev_greatex_chat" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp,
	"deleted_by" varchar,
	"user_id" varchar NOT NULL,
	"asset_id" uuid,
	"type" "chat_type" NOT NULL,
	"last_message_id" uuid,
	"last_message_text" varchar,
	"last_message_time" timestamp,
	"last_message_sender_id" varchar,
	"last_message_status" "message_status" DEFAULT 'SENT' NOT NULL,
	"last_message_content_type" "message_content_type",
	"last_message_sender" "last_message_sender",
	"participant_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dev_greatex_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp,
	"deleted_by" varchar,
	"owner_id" varchar NOT NULL,
	"message_id" uuid,
	"url" varchar NOT NULL,
	"type" varchar(50) NOT NULL,
	"file_name" varchar NOT NULL,
	"size" numeric(10, 0) NOT NULL,
	"mime_type" varchar(100),
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dev_greatex_message" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp,
	"deleted_by" varchar,
	"chat_id" uuid NOT NULL,
	"text" varchar NOT NULL,
	"type" "message_type" DEFAULT 'STANDARD' NOT NULL,
	"sender_id" varchar NOT NULL,
	"parent_id" uuid,
	"thread_root" uuid,
	"is_admin" boolean DEFAULT false NOT NULL,
	"status" "message_status" DEFAULT 'SENT' NOT NULL,
	"content_type" "message_content_type" DEFAULT 'TEXT' NOT NULL,
	"metadata" jsonb,
	"media_url" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dev_greatex_notification_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp,
	"deleted_by" varchar,
	"user_id" varchar NOT NULL,
	"preferences" jsonb NOT NULL,
	"is_subscribed" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dev_greatex_push_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp,
	"deleted_by" varchar,
	"user_id" varchar NOT NULL,
	"endpoint" varchar NOT NULL,
	"auth" varchar NOT NULL,
	"p256dh" varchar NOT NULL,
	"expiration_time" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dev_greatex_rate_limit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp,
	"deleted_by" varchar,
	"user_id" varchar NOT NULL,
	"action" varchar NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"window" timestamp NOT NULL,
	"ip_address" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dev_greatex_trade" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp,
	"deleted_by" varchar,
	"user_id" varchar NOT NULL,
	"asset_id" uuid NOT NULL,
	"chat_id" uuid NOT NULL,
	"currency" "currency_type" DEFAULT 'USD' NOT NULL,
	"status" "trade_status" NOT NULL,
	"amount_in_currency" numeric(18, 2),
	"amount_in_ngn" numeric(18, 2),
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dev_greatex_trade_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp,
	"deleted_by" varchar,
	"trade_id" uuid NOT NULL,
	"old_status" "trade_status",
	"new_status" "trade_status" NOT NULL,
	"changed_by" varchar NOT NULL,
	"reason" varchar,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dev_greatex_user" (
	"id" varchar PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp,
	"deleted_by" varchar,
	"username" varchar(255),
	"first_name" varchar(255),
	"last_name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image_url" varchar(255),
	"profile_image_url" varchar(255),
	"birthday" timestamp,
	"gender" varchar(50),
	"password_enabled" boolean DEFAULT true NOT NULL,
	"two_factor_enabled" boolean DEFAULT false NOT NULL,
	"external_id" varchar(255),
	"last_sign_in_at" timestamp,
	"disabled" boolean DEFAULT false NOT NULL,
	"metadata" jsonb,
	CONSTRAINT "dev_greatex_user_username_unique" UNIQUE("username"),
	CONSTRAINT "dev_greatex_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dev_greatex_chat" ADD CONSTRAINT "dev_greatex_chat_user_id_dev_greatex_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."dev_greatex_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dev_greatex_chat" ADD CONSTRAINT "dev_greatex_chat_asset_id_dev_greatex_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."dev_greatex_asset"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dev_greatex_media" ADD CONSTRAINT "dev_greatex_media_owner_id_dev_greatex_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."dev_greatex_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dev_greatex_media" ADD CONSTRAINT "dev_greatex_media_message_id_dev_greatex_message_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."dev_greatex_message"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dev_greatex_message" ADD CONSTRAINT "dev_greatex_message_chat_id_dev_greatex_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."dev_greatex_chat"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dev_greatex_message" ADD CONSTRAINT "dev_greatex_message_sender_id_dev_greatex_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."dev_greatex_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dev_greatex_message" ADD CONSTRAINT "dev_greatex_message_parent_id_dev_greatex_message_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."dev_greatex_message"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dev_greatex_message" ADD CONSTRAINT "dev_greatex_message_thread_root_dev_greatex_message_id_fk" FOREIGN KEY ("thread_root") REFERENCES "public"."dev_greatex_message"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dev_greatex_notification_preferences" ADD CONSTRAINT "dev_greatex_notification_preferences_user_id_dev_greatex_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."dev_greatex_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dev_greatex_push_subscriptions" ADD CONSTRAINT "dev_greatex_push_subscriptions_user_id_dev_greatex_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."dev_greatex_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dev_greatex_rate_limit" ADD CONSTRAINT "dev_greatex_rate_limit_user_id_dev_greatex_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."dev_greatex_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dev_greatex_trade" ADD CONSTRAINT "dev_greatex_trade_user_id_dev_greatex_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."dev_greatex_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dev_greatex_trade" ADD CONSTRAINT "dev_greatex_trade_asset_id_dev_greatex_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."dev_greatex_asset"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dev_greatex_trade" ADD CONSTRAINT "dev_greatex_trade_chat_id_dev_greatex_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."dev_greatex_chat"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dev_greatex_trade_status_history" ADD CONSTRAINT "dev_greatex_trade_status_history_trade_id_dev_greatex_trade_id_fk" FOREIGN KEY ("trade_id") REFERENCES "public"."dev_greatex_trade"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dev_greatex_trade_status_history" ADD CONSTRAINT "dev_greatex_trade_status_history_changed_by_dev_greatex_user_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."dev_greatex_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "asset_type_idx" ON "dev_greatex_asset" USING btree ("type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "asset_name_idx" ON "dev_greatex_asset" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "popular_assets_idx" ON "dev_greatex_asset" USING btree ("trade_count" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_user_id_idx" ON "dev_greatex_chat" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_asset_id_idx" ON "dev_greatex_chat" USING btree ("asset_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_last_message_time_idx" ON "dev_greatex_chat" USING btree ("last_message_time");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_type_idx" ON "dev_greatex_chat" USING btree ("type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "media_owner_id_idx" ON "dev_greatex_media" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "media_type_idx" ON "dev_greatex_media" USING btree ("type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "media_owner_type_idx" ON "dev_greatex_media" USING btree ("owner_id","type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "message_chat_id_idx" ON "dev_greatex_message" USING btree ("chat_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "message_sender_id_idx" ON "dev_greatex_message" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "message_thread_root_idx" ON "dev_greatex_message" USING btree ("thread_root");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "message_chat_time_idx" ON "dev_greatex_message" USING btree ("chat_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "trade_user_id_idx" ON "dev_greatex_trade" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "trade_asset_id_idx" ON "dev_greatex_trade" USING btree ("asset_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "trade_status_idx" ON "dev_greatex_trade" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "trade_user_status_idx" ON "dev_greatex_trade" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "trade_amount_idx" ON "dev_greatex_trade" USING btree ("amount_in_currency");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "trade_user_time_idx" ON "dev_greatex_trade" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "active_trades_idx" ON "dev_greatex_trade" USING btree ("status","created_at") WHERE status = 'ACTIVE';--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_email_idx" ON "dev_greatex_user" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_username_idx" ON "dev_greatex_user" USING btree ("username");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_external_id_idx" ON "dev_greatex_user" USING btree ("external_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_name_search_idx" ON "dev_greatex_user" USING btree ("first_name","last_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "active_users_idx" ON "dev_greatex_user" USING btree ("last_sign_in_at") WHERE disabled = false AND deleted = false;