"use client";

import { adminCurrConversationStore } from "@/lib/utils/store/adminConversation";
import React from "react";
import AdminRenderMessages from "./AdminRenderMessages";

type Props = {
  scrollToBottom: React.RefObject<HTMLDivElement>;
  chatId: string;
};

const AdminChatContainer = ({ chatId, scrollToBottom }: Props) => {
  const { conversation } = adminCurrConversationStore();

  return (
    <div className="max-w-screen-md mx-auto" ref={scrollToBottom}>
      {conversation ? (
        <AdminRenderMessages
          scrollToBottom={scrollToBottom}
          card={conversation.transaction.cardDetails}
          chatId={chatId}
          data={conversation}
        />
      ) : (
        <div className="text-center p-8 dark:text-opacity-40">
          Loading Messages...
        </div>
      )}
      <div className="h-28" />
    </div>
  );
};

export default AdminChatContainer;
