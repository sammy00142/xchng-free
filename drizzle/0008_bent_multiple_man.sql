ALTER TABLE "greatex_trade" DROP CONSTRAINT "greatex_trade_chat_id_greatex_chat_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "greatex_trade" ADD CONSTRAINT "greatex_trade_chat_id_greatex_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."greatex_chat"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
