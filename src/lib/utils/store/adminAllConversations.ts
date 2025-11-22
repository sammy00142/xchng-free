import { create } from "zustand";
import { Conversation, ConversationCollections } from "../../../../chat";
import { getConversationsFromDB } from "../indexedDb/adminConversations";

type States = {
  allConversations: ConversationCollections | undefined;
  readConversationsNumber: number;
  unReadConversationsNumber: number;
};

type Actions = {
  updateAllConversations: () => Promise<void>;
  updateUnReadConversationsNumber: (count: number) => void;
  updateReadConversationsNumber: (count: number) => void;
};

export const adminConversationsStore = create<States & Actions>((set) => ({
  allConversations: undefined,
  readConversationsNumber: 0,
  unReadConversationsNumber: 0,
  updateAllConversations: async () => {
    const data = (await getConversationsFromDB()) as ConversationCollections;

    if (data && data.length > 0) {
      const unreadChatsNumber = data.filter((chat) => {
        return chat.data.lastMessage.read_receipt.status !== true;
      });

      set({
        allConversations: [...data],
        unReadConversationsNumber: unreadChatsNumber.length,
      });
    }
  },
  updateUnReadConversationsNumber: (count: number) => {
    set({ unReadConversationsNumber: count });
  },
  updateReadConversationsNumber: (count: number) => {
    set({ readConversationsNumber: count });
  },
}));
