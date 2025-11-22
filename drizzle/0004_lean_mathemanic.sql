DO $$ BEGIN
 CREATE TYPE "public"."last_message_sender" AS ENUM('USER', 'ADMIN');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "greatex_chat" ADD COLUMN "last_message_sender" "last_message_sender";