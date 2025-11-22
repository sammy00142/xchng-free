"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ImageIcon,
  MessageCircle,
  RefreshCw,
  MoreVertical,
  Star,
  Archive,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChatStore } from "@/lib/stores/chat-store";
import { supabase } from "@/lib/utils/supabase/client";
import { api } from "@/trpc/react";
import { type ChatWithRelations } from "@/server/db/schema";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Chat = ChatWithRelations;

export default function AdminRecentChats() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {
    data: chatData,
    isLoading,
    refetch,
  } = api.adminChat.getAllChats.useQuery({ limit: 5 });
  const { addChat, getChat, updateChat, chats, setChats, deleteAllChats } =
    useChatStore();
  const router = useRouter();

  useEffect(() => {
    if (chats.length === 0 && chatData?.items) {
      chatData.items.forEach(addChat);
    }

    if (chats.length !== chatData?.items.length) {
      deleteAllChats();
      setChats(chatData?.items ?? []);
    }
  }, [addChat, chatData?.items, chats.length, setChats, deleteAllChats]);

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
      .subscribe();

    return () => {
      supabase.removeChannel(chatChannel);
    };
  }, [addChat, getChat, updateChat]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const sortedChats = useMemo(() => {
    return [...chats]
      .sort(
        (a, b) =>
          new Date(b.lastMessageTime ?? b.createdAt ?? b.updatedAt).getTime() -
          new Date(a.lastMessageTime ?? a.createdAt ?? a.updatedAt).getTime()
      )
      .slice(0, 3);
  }, [chats]);

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8 dark:bg-neutral-950">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Recent Chats</CardTitle>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/chat")}
            disabled={isLoading || isRefreshing}
          >
            <span>View all</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isLoading || isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span className="sr-only">Refresh chats</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <ChatSkeleton />
        ) : sortedChats.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No recent chats found
          </p>
        ) : (
          <motion.div
            className="space-y-2"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {sortedChats.map((chat) => (
              <ChatItem key={chat.id} chat={chat} />
            ))}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

function ChatItem({ chat }: { chat: Chat }) {
  // const isUnread =
  //   chat.lastMessageStatus !== "SEEN" && chat.lastMessageSender === "USER";

  const isUnread = chat.lastMessageId && chat.lastMessageStatus !== "SEEN";
  const isFromAdmin = chat.messages?.[0]?.isAdmin;

  const getMessageTextClass = () =>
    (isUnread && !isFromAdmin) || !chat.lastMessageId
      ? "font-semibold text-secondary"
      : "";

  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
      }}
    >
      <Card className="hover:dark:bg-neutral-900 dark:bg-neutral-950 hover:bg-neutral-200/60 transition-colors duration-200">
        {/* <CardHeader className="flex flex-row items-center justify-between p-2">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Star className="h-4 w-4" />
              <span className="sr-only">Star chat</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Archive className="h-4 w-4" />
              <span className="sr-only">Archive chat</span>
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Mark as read</DropdownMenuItem>
              <DropdownMenuItem>Mute notifications</DropdownMenuItem>
              <DropdownMenuItem>Delete chat</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader> */}
        <CardContent className="px-4 py-2.5">
          <Link
            href={`/admin/chat/${chat.id}`}
            className="flex items-center space-x-4"
          >
            <div className="relative">
              <Image
                src={chat.user?.imageUrl ?? "/default-avatar.png"}
                alt={chat.user?.username ?? "User"}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <Image
                src={chat.asset?.coverImage ?? "/default-asset.png"}
                alt="Asset"
                width={20}
                height={20}
                className="absolute -bottom-1 bg-white -right-1 rounded-full border-2 border-background"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate capitalize">
                {chat.user?.username}
              </p>
              <div
                className={`flex items-center text-xs ${getMessageTextClass()}`}
              >
                {chat.lastMessageContentType === "MEDIA" ? (
                  <ImageIcon className="mr-1 h-3 w-3" />
                ) : (
                  <MessageCircle className="mr-1 h-3 w-3" />
                )}
                <p className="truncate">
                  {chat.lastMessageText || "Empty message"}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(
                  new Date(
                    chat.lastMessageTime ?? chat.createdAt ?? chat.updatedAt
                  ),
                  {
                    addSuffix: true,
                  }
                )}
              </p>
              {isUnread && (
                <span className="inline-flex items-center rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                  New Trade
                </span>
              )}
            </div>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ChatSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Card key={i}>
          {/* <CardHeader className="flex flex-row items-center justify-between p-2">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </CardHeader> */}
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[160px]" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
