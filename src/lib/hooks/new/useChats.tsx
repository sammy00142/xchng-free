"use client";

import { useEffect, useState } from "react";
import { ChatWithRelations } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { useChatStore } from "@/lib/stores/chat-store";

export function useChatSession(chatId: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [chat, setChat] = useState<ChatWithRelations | null>(null);
  const { getChat, addChat } = useChatStore();

  const { data: chatData } = api.chat.getChat.useQuery({ chatId });
  const { data: tradeData } = api.trade.getTradeByChatId.useQuery({ chatId });
  const { data: messagesData } = api.chat.getMessages.useQuery({
    chatId,
    limit: 50,
  });

  useEffect(() => {
    if (chatData && chatId) {
      setIsLoading(false);
    }
  }, [chatData, chatId]);

  // update chat effect
  useEffect(() => {
    if (chatData) {
      if (getChat(chatId)) {
        setChat(chatData);
      } else {
        addChat(chatData);
      }
    }
  }, [addChat, chatData, chatId, getChat]);

  // const sendMessage = api.chat.sendMessage.useMutation({
  //   onSuccess: () => {
  //     // Invalidate queries

  //   },
  // });

  return {
    chat,
    trade: tradeData,
    isLoading: isLoading || (!chatData && !!chatId),
    // sendMessage: sendMessage.mutateAsync,
    // isError: sendMessage.isError,
    // error: sendMessage.error,
    hasMore: messagesData?.nextCursor !== undefined,
    nextCursor: messagesData?.nextCursor,
  };
}
