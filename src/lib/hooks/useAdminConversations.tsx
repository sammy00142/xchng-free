"use client";

import { useEffect, useState } from "react";
import { ConversationCollections } from "../../../chat";
import { db } from "../utils/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { adminConversationsStore } from "../utils/store/adminAllConversations";
import { saveConversationsToDB } from "../utils/indexedDb/adminConversations";

const useAdminConversations = () => {
  const [conversationState, setConversationState] =
    useState<ConversationCollections>();
  const {
    allConversations,
    updateAllConversations,
    updateUnReadConversationsNumber,
    unReadConversationsNumber,
  } = adminConversationsStore();

  useEffect(() => {
    const fetchChats = (): (() => void) | undefined => {
      const q = query(
        collection(
          db,
          process.env.NODE_ENV === "development" ? "test-Messages" : "Messages"
        ),
        orderBy("updated_at", "desc")
      );

      return onSnapshot(q, (querySnapshot) => {
        const chatData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));

        console.log("CHAT UPDATED", chatData);

        const unreadChats = chatData.filter(
          (chat) =>
            chat?.data?.lastMessage?.read_receipt?.delivery_status !== "seen"
        );

        if (chatData && chatData.length > 0) {
          setConversationState(chatData as ConversationCollections);
          saveConversationsToDB(chatData as ConversationCollections);
          updateAllConversations();
        }
        updateUnReadConversationsNumber(unreadChats.length);
      });
    };

    const unsubscribe = fetchChats();
    return () => unsubscribe && unsubscribe();
  }, [updateAllConversations, updateUnReadConversationsNumber]);

  useEffect(() => {
    if (conversationState && conversationState.length > 0) {
      saveConversationsToDB(conversationState);
    }

    updateAllConversations();
  }, [conversationState, updateAllConversations]);

  return { allConversations, unReadConversationsNumber };
};

export default useAdminConversations;
