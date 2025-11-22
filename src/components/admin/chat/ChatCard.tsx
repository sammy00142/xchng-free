"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ImageIcon } from "@radix-ui/react-icons";
import { doc, updateDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import { formatTime } from "@/lib/utils/formatTime";
import { db } from "@/lib/utils/firebase";
import { Conversation, LastMessage } from "../../../../chat";

type Props = {
  chat?: {
    id: string;
    data: Conversation;
    count?: number;
  };
  chat2?: Conversation;
  idx?: number;
  isAdmin: boolean;
};

const ChatCard: React.FC<Props> = ({ chat, chat2,  isAdmin }) => {

  const userCookie = Cookies.get("user");
  const user = React.useMemo(
    () => JSON.parse(userCookie || "{}"),
    [userCookie]
  );

  const markRead = React.useCallback(
    async (lastMessage: LastMessage, chatId: string) => {
      if (!lastMessage.seen && lastMessage.sender !== user.uid) {
        console.log("MARKED SEEN");
        const chatRef = doc(
          db,
          process.env.NODE_ENV === "development" ? "test-Messages" : "Messages",
          chatId
        );
        await updateDoc(chatRef, {
          lastMessage: {
            ...lastMessage,
            read_receipt: {
              ...lastMessage.read_receipt,
              delivery_status: "seen",
              status: true,
            },
            seen: true,
          },
        });
      }
    },
    [user.uid]
  );

  const renderChatContent = (chatData: Conversation, chatId: string) => {
    const isUnread = !chatData.lastMessage.read_receipt.status;
    const isFromCurrentUser = chatData.lastMessage.sender === user.uid;

    const getMessageTextClass = () => {
      if (isUnread && !isFromCurrentUser) {
        return "font-semibold text-secondary";
      }
      return "";
    };

    return (
      <div
        className="flex items-center justify-between h-fit w-full duration-300 max-w-lg mx-auto hover:bg-neutral-200 dark:hover:bg-black/20"
        onClick={() => markRead(chatData.lastMessage, chatId)}
      >
        <Link
          href={`${isAdmin ? "/admin" : ""}/chat/${chatId}`}
          className="flex items-center justify-between dark:bg-opacity-10 dark:active:bg-black px-4 py-3 duration-300 dark:text-white w-full h-fit"
        >
          <div className="flex items-center justify-between gap-4 w-full">
            {chatData.user.photoUrl ? (
              <Image
                src={chatData.user.photoUrl}
                alt={chatData.user.username}
                width={45}
                height={45}
                className="aspect-square rounded-full object-cover"
              />
            ) : (
              <div className="p-5 h-12 w-12 bg-gradient-to-tr rounded-full from-zinc-300 self-center to-stone-400 active:to-zinc-300 active:from-stone-500 shadow-primary" />
            )}
            <div className="w-full">
              <h4
                className={`truncate max-w-[10rem] md:max-w-[13rem] ${getMessageTextClass()}`}
              >
                {chatData.lastMessage.content.media ? (
                  <div className="flex items-center gap-1">
                    <ImageIcon />
                    <p>Image</p>
                  </div>
                ) : (
                  chatData.lastMessage.content.text
                )}
              </h4>
              <div className="flex items-center justify-between pt-1 w-full h-fit">
                <p className="text-xs text-neutral-400 font-medium capitalize">
                  {isAdmin
                    ? isFromCurrentUser
                      ? "You"
                      : "Great Exchange"
                    : isFromCurrentUser
                    ? "you"
                    : chat?.data.user.username}
                </p>
                <p className="text-[12px] text-neutral-500">
                  {formatTime(
                    new Date(
                      (chatData.updated_at.seconds ?? 0) * 1000 +
                        (chatData.updated_at.nanoseconds ?? 0) / 1e6
                    ).toISOString()
                  )}
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  if (chat) {
    return renderChatContent(chat.data, chat.id);
  } else if (chat2) {
    return renderChatContent(chat2, chat2.id);
  }

  return null;
};

export default ChatCard;
