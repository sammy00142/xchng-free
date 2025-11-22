"use client";

import Loading from "@/app/loading";
import AdminDisplayChats from "@/components/chat/admin-display-chats";
import { useChatStore } from "@/lib/stores/chat-store";
import { supabase } from "@/lib/utils/supabase/client";
import { api } from "@/trpc/react";
import { useEffect } from "react";
import SearchBar from "./_components/search-bar";

const AdminChats = () => {
  const { data: chatData, isLoading } = api.adminChat.getAllChats.useQuery({
    limit: 50,
  });

  const { addChat, getChat, updateChat } = useChatStore();

  useEffect(() => {
    const chatChannel = supabase
      .channel("chat_channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "greatex_chat",
        },
        (payload: { new: Record<string, any> }) => {
          const newChat = {
            assetId: payload.new.asset_id,
            createdAt: payload.new.created_at,
            deleted: payload.new.deleted,
            deletedAt: payload.new.deleted_at,
            deletedBy: payload.new.deleted_by,
            id: payload.new.id,
            lastMessageId: payload.new.last_message_id,
            lastMessageSenderId: payload.new.last_message_sender_id,
            lastMessageText: payload.new.last_message_text,
            lastMessageTime: payload.new.last_message_time,
            metadata: payload.new.metadata,
            participantCount: payload.new.participant_count,
            type: payload.new.type,
            updatedAt: payload.new.updated_at,
            userId: payload.new.user_id,
            lastMessageStatus: payload.new.last_message_status,
            lastMessageContentType: payload.new.last_message_content_type,
            lastMessageSender: payload.new.last_message_sender,
          };

          const existingChat = getChat(newChat.id);

          if (existingChat) {
            updateChat(newChat.id, newChat);
          } else {
            addChat(newChat);
          }
        }
      )
      .subscribe((status) => {
        console.log(`🔛Supabase status chat_channel:`, status);
      });

    return () => {
      supabase.removeChannel(chatChannel);
    };
  }, [addChat, chatData, getChat, updateChat]);

  if (!isLoading && !chatData) {
    return (
      <div className="h-[50dvh] font-semibold w-screen flex place-items-center text-center justify-center">
        No chats found
      </div>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <SearchBar />
      <AdminDisplayChats />
    </div>
  );
};

export default AdminChats;
