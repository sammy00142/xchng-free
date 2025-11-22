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
import { AdminChatHeader } from "./admin-chat-header";
import { AdminChatMessage } from "./admin-chat-message";
import { AdminChatInput } from "./admin-chat-input";
import { useUser } from "@clerk/nextjs";
import {
  ChatWithRelations,
  MessageWithRelations,
  TradeWithRelations,
  UserSelect,
} from "@/server/db/schema";
import { useChatStore } from "@/lib/stores/chat-store";
import { api } from "@/trpc/react";
import { supabase } from "@/lib/utils/supabase/client";
import { AdminChatAssetInfo } from "./admin-chat-asset-info";
import { useAtomValue } from "jotai";
import { presenceAtom } from "@/lib/stores/presence-store";

type TypingUser = {
  userId: string;
  username?: string;
};

export default function AdminChatScreen({
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
  const sendMessage = api.adminChat.sendAdminMessage.useMutation({
    retry(failureCount) {
      if (failureCount > 3) {
        return false;
      }
      return true;
    },
    retryDelay(failureCount) {
      return failureCount * 1000;
    },
    onSuccess: () => {
      utils.adminChat.getChat.invalidate({ chatId: params.chatId });
      utils.adminChat.getMessages.invalidate({ chatId: params.chatId });
      utils.adminChat.listChats.invalidate();
    },
  });
  const sendNotification =
    api.notification.sendNotificationToUser.useMutation();

  const { user } = useUser();
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const typingChannel = useRef<ReturnType<typeof supabase.channel>>();

  const activeUsers = useAtomValue(presenceAtom);

  useEffect(() => {
    if (!user?.id || !params.chatId) return;

    typingChannel.current = supabase
      .channel(`typing:${params.chatId}`)
      .on("presence", { event: "sync" }, () => {
        const state = typingChannel.current?.presenceState() || {};
        const typing = Object.values(state)
          .flat()
          .map((presence) => {
            const presenceData = presence as any;
            return {
              userId: presenceData.userId,
              username: presenceData.username,
            } as TypingUser;
          });
        setTypingUsers(typing.filter((t) => t.userId !== user.id));
      })
      .subscribe();

    return () => {
      typingChannel.current?.unsubscribe();
    };
  }, [params.chatId, user?.id]);

  const handleTypingStart = useCallback(() => {
    typingChannel.current?.track({
      userId: user?.id,
      username: user?.username || user?.emailAddresses[0]?.emailAddress,
    });
  }, [user?.id, user?.username, user?.emailAddresses]);

  const handleTypingStop = useCallback(() => {
    typingChannel.current?.untrack();
  }, []);

  const typingIndicator = useMemo(() => {
    if (typingUsers.length === 0) return null;

    const names = typingUsers.map((u) => u.username).join(", ");
    return (
      <div className="px-4 text-sm text-muted-foreground italic">
        {names} {typingUsers.length === 1 ? "is" : "are"} typing...
      </div>
    );
  }, [typingUsers]);

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

  const handleSendMessage = useCallback(async () => {
    if (inputMessage.trim() === "") return;

    const messageId = v4();

    const newMessage: MessageWithRelations = {
      chatId: params.chatId,
      contentType: "TEXT",
      createdAt: new Date(new Date().getTime() + 60 * 60 * 1000),
      id: messageId,
      deleted: false,
      deletedAt: null,
      deletedBy: null,
      text: inputMessage.trim(),
      isAdmin: true,
      metadata: null,
      parentId: replyingTo ?? null,
      senderId: user?.id!,
      status: "NOT_SENT",
      threadRoot: null,
      type: "STANDARD",
      updatedAt: new Date(new Date().getTime() + 60 * 60 * 1000),
      media: [],
      mediaUrl: null,
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
      });

      const isUserOnline = activeUsers.some(
        (u) => u.userId === chat?.user?.id && !u.isAdmin
      );
      if (!isUserOnline && chat?.user?.id) {
        await sendNotification.mutateAsync({
          userId: chat.user.id,
          payload: {
            title: "New message",
            body: newMessage.text,
            url: `${process.env.NEXT_PUBLIC_APP_URL}/chat/${params.chatId}`,
          },
        });
      }
    } catch (error) {
      console.error(error);
    }

    setReplyingTo(null);
    setIsTyping(false);
  }, [
    inputMessage,
    params.chatId,
    replyingTo,
    user?.id,
    user?.publicMetadata.role,
    addMessage,
    sendMessage,
    activeUsers,
    sendNotification,
    chat?.user?.id,
  ]);

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
      onTypingStart: handleTypingStart,
      onTypingStop: handleTypingStop,
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
      handleTypingStart,
      handleTypingStop,
    ]
  );

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto overflow-hidden">
      <AdminChatHeader
        user={chat?.user as UserSelect}
        onBack={() => router.back()}
      />

      <ScrollArea className="flex-grow px-4 box-border overflow-scroll">
        <AdminChatAssetInfo asset={chat?.asset} trade={trade} />
        {messages?.map((message) => (
          <AdminChatMessage
            key={message.id}
            user={chat?.user as UserSelect}
            message={message}
            onReply={(messageId) => setReplyingTo(messageId)}
            replyMessage={
              message.parentId
                ? messages?.find((m) => m.id === message.parentId)
                : undefined
            }
          />
        ))}

        {typingIndicator}
        <div className="h-6" ref={scrollAreaRef} />
      </ScrollArea>
      <AdminChatInput {...chatInputProps} />
    </div>
  );
}
