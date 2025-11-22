"use client";

import { useChatStore } from "@/lib/stores/chat-store";
import { ChatWithRelations } from "@/server/db/schema";
import { ReactNode, useEffect } from "react";

type Props = {
  chat: ChatWithRelations;
  children: ReactNode;
};

const InitChatLayout = (props: Props) => {
  const { updateChat, getChat, addChat } = useChatStore();

  useEffect(() => {
    const chatExists = !!getChat(props.chat.id);
    if (chatExists) {
      updateChat(props.chat.id, {
        messages: props.chat.messages,
      });
    } else {
      addChat(props.chat);
    }
  }, [addChat, getChat, props.chat, updateChat]);

  return <div>{props.children}</div>;
};

export default InitChatLayout;
