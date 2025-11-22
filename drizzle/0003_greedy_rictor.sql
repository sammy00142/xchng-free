ALTER TABLE "greatex_chat" ADD COLUMN "last_message_content_type" "message_content_type";--> statement-breakpoint
ALTER TABLE "greatex_chat" DROP COLUMN IF EXISTS "metadata";