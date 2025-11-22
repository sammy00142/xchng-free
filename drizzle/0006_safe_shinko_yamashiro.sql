ALTER TABLE "greatex_asset" ALTER COLUMN "deleted_by" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "greatex_audit_log" ALTER COLUMN "deleted_by" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "greatex_chat" ALTER COLUMN "deleted_by" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "greatex_media" ALTER COLUMN "deleted_by" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "greatex_message" ALTER COLUMN "deleted_by" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "greatex_notification_preferences" ALTER COLUMN "deleted_by" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "greatex_push_subscriptions" ALTER COLUMN "deleted_by" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "greatex_rate_limit" ALTER COLUMN "deleted_by" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "greatex_trade" ALTER COLUMN "deleted_by" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "greatex_trade_status_history" ALTER COLUMN "deleted_by" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "greatex_user" ALTER COLUMN "deleted_by" SET DATA TYPE varchar;