"use client";

import { useEffect, useState } from "react";
import { ChatWithRelations } from "@/server/db/schema";
import { supabase } from "@/lib/utils/supabase/client";
import { useSession } from "@clerk/nextjs";
import { api } from "@/trpc/react";

export function useAllChats() {
  const [chats, setChats] = useState<ChatWithRelations[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [chatType, setChatType] = useState<
    "TRADE" | "SUPPORT" | "GENERAL" | undefined
  >();

  // Check if user is admin

  // Get chat statistics
  // TRPC query for initial chats with pagination
  const {
    data: chatData,
    isError: isFetchChatsError,
    isLoading: isFetchChatLoading,
    fetchNextPage,
    hasNextPage,
  } = api.chat.getChatsByUserId.useInfiniteQuery(
    {
      limit: 100,
      type: chatType,
      searchQuery,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const utils = api.useUtils();

  // Update chats when data is loaded
  useEffect(() => {
    if (chatData?.pages) {
      const allChats = chatData.pages.flatMap((page) => page.items);
      setChats(allChats as ChatWithRelations[]);
      setIsLoading(false);
    }
  }, [chatData]);

  // Real-time updates
  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = supabase
      .channel(`admin_chats`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "greatex_chat",
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
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
              lastMessageStatus: payload.new.last_message_status,
              lastMessageContentType: payload.new.last_message_content_type,
              lastMessageSender: payload.new.last_message_sender,
              metadata: payload.new.metadata,
              participantCount: payload.new.participant_count,
              type: payload.new.type,
              updatedAt: payload.new.updated_at,
              userId: payload.new.user_id,
            };

            const existingChat = chats?.find((chat) => chat.id === newChat.id);

            if (existingChat) {
              setChats((prev) =>
                prev
                  ? prev.map((chat) =>
                      chat.id === newChat.id
                        ? {
                            ...newChat,
                            user: chat.user,
                            asset: chat.asset,
                            trade: chat.trade,
                          }
                        : chat
                    )
                  : [newChat]
              );
            } else {
              setChats((prev) => (prev ? [newChat, ...prev] : [newChat]));
            }

            await utils.chat.getAllChats.invalidate();
          }
          if (payload.eventType === "DELETE") {
            const deletedChatId = payload.old.id;
            setChats((prev) =>
              prev ? prev.filter((chat) => chat.id !== deletedChatId) : []
            );
          }
          if (payload.eventType === "UPDATE") {
            const updatedChat = {
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
              lastMessageSender: payload.new.last_message_sender,
              metadata: payload.new.metadata,
              participantCount: payload.new.participant_count,
              type: payload.new.type,
              updatedAt: payload.new.updated_at,
              userId: payload.new.user_id,
              lastMessageStatus: payload.new.last_message_status,
              lastMessageContentType: payload.new.last_message_content_type,
            };

            setChats((prev) =>
              prev
                ? prev.map((chat) =>
                    chat.id === updatedChat.id
                      ? {
                          ...updatedChat,
                          user: chat.user,
                          asset: chat.asset,
                          trade: chat.trade,
                        }
                      : chat
                  )
                : []
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chats, session?.user?.id, utils]);

  const markChatAsSeen = api.chat.markAsSeen.useMutation({
    onSuccess: () => {
      utils.chat.getChatsByUserId.invalidate();
    },
  });

  // Delete chat mutation
  const deleteChat = api.chat.delete.useMutation({
    onSuccess: () => {
      utils.chat.getChatsByUserId.invalidate();
    },
  });

  // Update chat mutation
  const updateChat = api.chat.update.useMutation({
    onSuccess: () => {
      utils.chat.getChatsByUserId.invalidate();
    },
  });

  // Load more chats
  const loadMore = async () => {
    if (hasNextPage) {
      await fetchNextPage();
    }
  };

  return {
    chats,
    isLoading,
    isFetchChatsError,
    isFetchChatLoading: isFetchChatLoading || isLoading,
    updateChat: updateChat.mutate,
    isUpdateChatError: updateChat.isError,
    chatUpdateError: updateChat.error,
    deleteChat: deleteChat.mutate,
    isDeleteChatError: deleteChat.isError,
    chatDeleteError: deleteChat.error,
    hasMore: hasNextPage,
    loadMore,
    markChatAsSeen: markChatAsSeen.mutate,
    // New additions
    setSearchQuery,
    setChatType,
    searchQuery,
    chatType,
  };
}
