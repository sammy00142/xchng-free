ALTER TABLE "greatex_push_subscriptions" ADD COLUMN "auth" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "greatex_push_subscriptions" ADD COLUMN "p256dh" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "greatex_push_subscriptions" DROP COLUMN IF EXISTS "keys";