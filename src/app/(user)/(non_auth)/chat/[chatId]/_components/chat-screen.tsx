"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { v4 } from "uuid";
import { useRouter } from "next/navigation";
import { ChatHeader } from "./chat-header";
import { ChatAssetInfo } from "./chat-asset-info";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { useUser } from "@clerk/nextjs";
import {
  ChatWithRelations,
  MessageWithRelations,
  TradeWithRelations,
} from "@/server/db/schema";
import { useChatStore } from "@/lib/stores/chat-store";
import { api } from "@/trpc/react";

export default function ChatScreen({
  params,
  chat,
  trade,
}: {
  params: { chatId: string };
  chat: ChatWithRelations | null;
  trade?: TradeWithRelations;
}) {
  const [inputMessage, setInputMessage] = useState("");
  const [_isTyping, setIsTyping] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<FileList | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const { addMessage, getChatMessages } = useChatStore();
  const utils = api.useUtils();
  const messages = getChatMessages(params.chatId);
  const sendMessage = api.chat.sendMessage.useMutation({
    onSuccess: () => {
      utils.chat.getChat.invalidate({ chatId: params.chatId });
      utils.chat.getMessages.invalidate({ chatId: params.chatId });
      utils.chat.listChats.invalidate();
    },
    retry(failureCount) {
      if (failureCount > 5) {
        return false;
      }
      return true;
    },
    retryDelay: 500,
  });
  const sendNotification =
    api.notification.sendNotificationToAdmin.useMutation();

  const { user } = useUser();

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom, messages]);

  const handleSendMessage = useCallback(
    async (mediaUrl?: string, caption?: string) => {
      if (inputMessage.trim() === "") return;

      const messageId = v4();

      const newMessage: MessageWithRelations = {
        chatId: params.chatId,
        contentType: "TEXT",
        createdAt: new Date(),
        id: messageId,
        deleted: false,
        deletedAt: null,
        deletedBy: null,
        text: caption ?? inputMessage.trim(),
        isAdmin: false,
        metadata: null,
        parentId: replyingTo ?? null,
        senderId: user?.id!,
        status: "NOT_SENT",
        threadRoot: null,
        type: "STANDARD",
        updatedAt: new Date(),
        media: [],
        mediaUrl: mediaUrl ?? null,
      };

      setInputMessage("");
      setReplyingTo(null);
      addMessage(params.chatId, newMessage);

      try {
        await sendMessage.mutateAsync({
          chatId: params.chatId,
          text: newMessage.text,
          isAdmin: user?.publicMetadata.role === "admin",
          messageId: messageId,
          replyToId: newMessage.parentId ?? null,
          contentType: newMessage.contentType,
        });

        await sendNotification.mutateAsync({
          title: replyingTo
            ? `Replied to your message - ${chat?.asset?.name} ${
                chat?.asset?.type === "CRYPTO" ? "Crypto" : "Gift Card"
              }`
            : `${chat?.asset?.name} ${
                chat?.asset?.type === "CRYPTO" ? "Crypto" : "Gift Card"
              } Trade request`,
          body: newMessage.text.slice(0, 50),
          url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/chat/${params.chatId}`,
        });
      } catch (error) {
        console.error(error);
      }

      setReplyingTo(null);
      setIsTyping(false);
    },
    [
      inputMessage,
      params.chatId,
      replyingTo,
      user?.id,
      user?.publicMetadata.role,
      addMessage,
      sendMessage,
      sendNotification,
      chat?.asset?.name,
      chat?.asset?.type,
    ]
  );

  const handleFileAttach = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        setAttachment(files);
      }
    },
    []
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputMessage(e.target.value);
      setIsTyping(true);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    },
    [setIsTyping]
  );

  const chatInputProps = useMemo(
    () => ({
      inputMessage,
      attachment,
      onInputChange: handleInputChange,
      onSendMessage: handleSendMessage,
      onFileAttach: handleFileAttach,
      replyingTo,
      replyMessage: replyingTo
        ? messages?.find((m) => m.id === replyingTo)
        : undefined,
      onCancelReply: () => setReplyingTo(null),
      onScrollToReply: (messageId: string) => router.push(`#${messageId}`),
      chatId: params.chatId,
    }),
    [
      inputMessage,
      attachment,
      handleInputChange,
      handleSendMessage,
      handleFileAttach,
      replyingTo,
      messages,
      params.chatId,
      router,
      setReplyingTo,
    ]
  );

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto overflow-hidden">
      <ChatHeader onBack={() => router.back()} />

      <ScrollArea className="flex-grow px-4 box-border overflow-scroll">
        <ChatAssetInfo asset={chat?.asset} trade={trade} />
        {messages?.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onReply={(messageId) => setReplyingTo(messageId)}
            replyMessage={
              message.parentId
                ? messages?.find((m) => m.id === message.parentId)
                : undefined
            }
          />
        ))}

        <div className="h-6" ref={scrollAreaRef} />
      </ScrollArea>
      <ChatInput {...chatInputProps} />
    </div>
  );
}
