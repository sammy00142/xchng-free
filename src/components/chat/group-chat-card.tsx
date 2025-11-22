"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { formatTime } from "@/lib/utils/formatTime";
import { ChatWithRelations } from "@/server/db/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";

interface User {
  id: string | null;
}

interface GroupedChatCardProps {
  chat: ChatWithRelations & { count?: number };
  isSelected: boolean;
  onSelect: (chatId: string) => void;
  user: User | null | undefined;
  isSelectionMode: boolean;
  onToggleSelectionMode: () => void;
}

const GroupedChatCard = ({
  chat,
  isSelected,
  onSelect,
  user,
  isSelectionMode,
  onToggleSelectionMode,
}: GroupedChatCardProps) => {
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [isHolding, setIsHolding] = useState(false);
  const router = useRouter();

  const handlePressStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      console.log("press start");
      const timer = setTimeout(() => {
        setIsHolding(true);
        onToggleSelectionMode();
        onSelect(chat.id);
      }, 500);
      setPressTimer(timer);
    },
    [chat.id, onToggleSelectionMode, onSelect]
  );

  const handlePressEnd = useCallback(() => {
    console.log("press end");
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
    setIsHolding(false);
  }, [pressTimer]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (isHolding) {
        e.preventDefault();
        return;
      }
      if (isSelectionMode) {
        e.preventDefault();
        onSelect(chat.id);
      } else {
        e.preventDefault();
        router.push(`/admin/chat/user-chats/${chat.userId}`);
      }
    },
    [isHolding, isSelectionMode, onSelect, chat.id, router, chat.userId]
  );

  const handleKeyPress = useCallback(() => {
    console.log("key press");
    const timer = setTimeout(() => {
      onToggleSelectionMode();
      onSelect(chat.id);
    }, 500);
    setPressTimer(timer);
  }, [chat.id, onToggleSelectionMode, onSelect]);

  const isUnread = chat.lastMessageId && chat.messages?.[0]?.status !== "SEEN";
  const isFromAdmin = chat.messages?.[0]?.isAdmin;

  const getMessageTextClass = () =>
    (isUnread && !isFromAdmin) || !chat.lastMessageId
      ? "font-semibold text-secondary"
      : "";

  return (
    <button
      type="button"
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleKeyPress();
        }
      }}
      onKeyUp={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handlePressEnd();
        }
      }}
      aria-pressed={isSelected}
      aria-label={`Select chat with ${chat.user?.username || "user"}`}
      className={`flex items-center h-fit w-full transition-all ease-in-out duration-300 max-w-lg mx-auto hover:bg-neutral-200 dark:hover:bg-black/20 pl-4 group relative ${
        isSelectionMode ? "bg-neutral-200 dark:bg-black/20" : ""
      }`}
    >
      {isSelectionMode && (
        <div className="flex items-center pr-2">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(chat.id)}
          />
        </div>
      )}

      <div className="flex items-center justify-between dark:bg-opacity-10 dark:active:bg-black pr-4 pl-2 py-3 duration-300 dark:text-white w-full h-fit relative">
        {!chat.count || chat.count < 2 ? (
          <div className="relative">
            <Image
              src={chat.user?.imageUrl ?? "/default-avatar.png"}
              alt={chat.user?.username ?? "Profile image"}
              width={45}
              height={45}
              className="aspect-square rounded-full object-cover"
            />
            <Image
              src={chat.asset?.coverImage ?? "/default-asset.png"}
              alt={chat.user?.username ?? "Profile image"}
              width={24}
              height={24}
              className="aspect-square absolute -bottom-0.5 border-2 border-white -right-0.5 rounded-full object-cover"
            />
          </div>
        ) : (
          <div className="flex align-middle place-items-center justify-start">
            <Image
              src={chat.user?.imageUrl ?? "/default-avatar.png"}
              alt={chat.user?.username ?? "Profile image"}
              width={45}
              height={45}
              className="aspect-square rounded-full object-cover border-4 duration-300 border-neutral-50 dark:border-black"
            />
            <Image
              src={chat.user?.imageUrl ?? "/default-avatar.png"}
              alt={chat.user?.username ?? "Profile image"}
              width={45}
              height={45}
              className="aspect-square scale-75 rounded-full object-cover border-4 duration-300 border-neutral-50 dark:border-black absolute left-[14px]"
            />
          </div>
        )}

        <div className="w-full pl-4">
          <h4
            className={`truncate max-w-[10rem] text-left md:max-w-[13rem] ${getMessageTextClass()}`}
          >
            {chat.lastMessageContentType === "MEDIA" ? (
              <div className="flex items-center gap-1">
                <ImageIcon size={17} />
                <p className="truncate max-w-[10rem] md:max-w-[13rem] text-xs">
                  {chat.lastMessageText ?? "Attachment"}
                </p>
              </div>
            ) : (
              chat.lastMessageText ?? "Attachment"
            )}
          </h4>
          <div className="flex items-center justify-between w-full h-fit">
            <p className="text-xs text-neutral-400 font-medium capitalize">
              {chat.messages?.[0]?.senderId === user?.id
                ? "you"
                : chat.user?.username}
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
          <div className="absolute right-2 top-1">
            <p className="px-2 py-1 text-white bg-green-600 rounded-sm scale-[0.45] font-semibold uppercase">
              New Trade
            </p>
          </div>
        )}
      </div>
    </button>
  );
};

export default GroupedChatCard;
