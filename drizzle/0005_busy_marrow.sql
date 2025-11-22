CREATE TABLE IF NOT EXISTS "greatex_notification_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp,
	"deleted_by" uuid,
	"user_id" varchar NOT NULL,
	"preferences" jsonb NOT NULL,
	"is_subscribed" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "greatex_push_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp,
	"deleted_by" uuid,
	"user_id" varchar NOT NULL,
	"endpoint" varchar NOT NULL,
	"keys" jsonb NOT NULL,
	"expiration_time" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "greatex_notification_preferences" ADD CONSTRAINT "greatex_notification_preferences_user_id_greatex_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."greatex_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "greatex_push_subscriptions" ADD CONSTRAINT "greatex_push_subscriptions_user_id_greatex_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."greatex_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
