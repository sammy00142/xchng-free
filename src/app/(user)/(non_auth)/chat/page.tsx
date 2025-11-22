"use client";

import Loading from "@/app/loading";
import DisplayChats from "@/components/chat/display-chats";
import SearchBar from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/lib/stores/chat-store";
import { supabase } from "@/lib/utils/supabase/client";
import { api } from "@/trpc/react";
import { useUser } from "@clerk/nextjs";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

const UserChats = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useUser();
  const {
    data: chatData,
    isLoading,
    isError,
  } = api.chat.listChats.useQuery(
    {
      userId: user?.id ?? "",
      limit: 460,
    },
    {
      enabled: !!user?.id,
    }
  );

  const { chats, addChat, getChat, updateChat } = useChatStore();

  useEffect(() => {
    const chatChannel = supabase
      .channel(`chat_user_${user?.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "greatex_chat",
          filter: `user_id=eq.${user?.id}`,
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
  }, [addChat, chatData, getChat, updateChat, user?.id]);

  if (!isLoading && !chats) {
    return (
      <div className="h-[50dvh] font-semibold w-screen flex place-items-center text-center justify-center">
        No chats found
      </div>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="error w-full h-screen flex flex-col gap-8 place-items-center pt-16">
        <p className="font-bold text-2xl uppercase">Error fetching chats</p>
        <p>There was an error fetching the chats. Please try again later.</p>
        <Button onClick={() => window.location.reload()}>
          <ReloadIcon className="mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <DisplayChats searchQuery={searchQuery} />
    </div>
  );
};

export default UserChats;
