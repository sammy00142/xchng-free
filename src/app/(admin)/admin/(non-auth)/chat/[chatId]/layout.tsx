import { api } from "@/trpc/server";
import { Metadata } from "next";
import React, { ReactNode } from "react";
import InitChatLayout from "./InitChatLayout";

type Props = {
  children: ReactNode;
  params: { chatId: string };
};

export const metadata: Metadata = {
  title: "Live Chat",
  description:
    "Great exchange is a giftcard exchange company, we buy your giftcards at high rates.",
};

const ChatIDLayout = async (props: Props) => {
  const chat = await api.adminChat.getChat({
    chatId: props.params.chatId,
  });

  return <InitChatLayout chat={chat}>{props.children}</InitChatLayout>;
};

export default ChatIDLayout;
