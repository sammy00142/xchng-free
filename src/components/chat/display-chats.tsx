"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import { formatTime } from "@/lib/utils/formatTime";
import { useUser } from "@clerk/nextjs";
import { ChatWithRelations } from "@/server/db/schema";
import { useAllChats } from "@/lib/hooks/new/use-all-chats";
import Loading from "@/app/loading";

const DisplayChats = ({ searchQuery }: { searchQuery: string }) => {
  const { user } = useUser();
  // const { chats: data } = useChatStore();
  const {
    chats: data,
    isFetchChatLoading,
    isFetchChatsError,
    markChatAsSeen,
  } = useAllChats();
  const chats = data?.filter(
    (chat) =>
      chat.asset?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessageText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.trade?.amountInCurrency
        ?.toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const groupChats = () => {
    if (!chats) return [];

    const map = new Map<string, ChatWithRelations & { count: number }>();

    for (const chat of chats) {
      if (map.has(chat.assetId ?? "")) {
        map.get(chat.assetId ?? "")!.count += 1;
      } else {
        map.set(chat.assetId ?? "", { ...chat, count: 1 });
      }
    }

    return Array.from(map.values()).sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  };

  if (isFetchChatLoading) return <Loading />;

  if (isFetchChatsError)
    return (
      <div className="h-[60dvh] w-full grid place-items-center justify-center text-sm">
        Error fetching chats
      </div>
    );

  if (!chats) {
    return (
      <div className="h-[60dvh] w-full grid place-items-center justify-center text-sm">
        No chats found
      </div>
    );
  }

  const groupedChats = groupChats();

  console.log("GROUPED CHATS", groupedChats);

  return (
    <div>
      {chats.map((chat) => {
        const isUnread =
          chat.lastMessageId && chat.messages?.[0]?.status !== "SEEN";
        const isFromAdmin = chat.messages?.[0]?.isAdmin;

        const getMessageTextClass = () => {
          if (isUnread && isFromAdmin) {
            return "font-semibold text-secondary";
          }
          return "";
        };

        return (
          <div
            key={chat.id}
            onClick={() =>
              markChatAsSeen({
                chatId: chat.id,
                messageIds: [chat.lastMessageId ?? ""],
              })
            }
            className="flex items-center justify-between h-fit w-full duration-300 max-w-lg mx-auto hover:bg-neutral-200 dark:hover:bg-neutral-800/20 pl-4 group relative"
          >
            {isFromAdmin && isUnread && (
              <div className="p-1 rounded-full bg-primary absolute left-2 top-1/2 -translate-y-1/2" />
            )}
            <Link
              href={`/chat/${chat.id}`}
              className="flex items-center justify-between dark:bg-opacity-10 dark:active:bg-black pr-4 pl-2 py-3 duration-300 dark:text-white w-full h-fit relative"
            >
              <div className={"relative"}>
                <Image
                  src={
                    chat.asset?.coverImage ??
                    "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yWVVEVWpEWGZUbWRub0VZY2xtOWR3SktXdGsiLCJyaWQiOiJ1c2VyXzJvRlB6VkNQVTNjbWNWSU15SkJIbnJPU0tRZCIsImluaXRpYWxzIjoiS0gifQ"
                  }
                  alt={chat.asset?.name ?? "Profile image"}
                  width={45}
                  height={45}
                  className="aspect-square rounded-full object-cover"
                />
              </div>
              <div className="w-full pl-4">
                <h4
                  className={`truncate text-sm max-w-[10rem] md:max-w-[13rem] ${getMessageTextClass()}`}
                >
                  {chat.messages?.[0]?.contentType === "MEDIA" ? (
                    <div className="flex items-center gap-1">
                      <ImageIcon size={16} />
                      <p>{chat.lastMessageText ?? "Attachment"}</p>
                    </div>
                  ) : (
                    chat.lastMessageText ?? chat.asset?.name
                  )}
                </h4>
                <div className="flex items-center justify-between w-full h-fit">
                  <p className="text-xs text-neutral-400 font-medium capitalize">
                    {chat.messages?.[0]?.senderId === user?.id
                      ? "you"
                      : "Great Exchange"}
                  </p>
                  <p className="text-[12px] text-neutral-500">
                    {formatTime(
                      chat.lastMessageTime?.toString() ??
                        chat.updatedAt.toString() ??
                        chat.createdAt.toString()
                    )}
                  </p>
                </div>
              </div>
              {!chat.lastMessageId && (
                <div className="absolute right-1 top-1">
                  <p className="px-2 py-1 bg-yellow-400  rounded-sm scale-[0.5] font-semibold uppercase text-yellow-800">
                    Waiting
                  </p>
                </div>
              )}
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default DisplayChats;
