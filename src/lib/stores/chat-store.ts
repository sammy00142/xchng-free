import { ChatWithRelations, MessageWithRelations } from "@/server/db/schema";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { get, set, del } from "idb-keyval";

type ChatsStore = {
  chats: ChatWithRelations[];
  addChat: (chat: ChatWithRelations) => void;
  getChatMessages: (chatId: string) => MessageWithRelations[];
  addMessage: (chatId: string, message: MessageWithRelations) => void;
  getChat: (chatId: string) => ChatWithRelations | undefined;
  updateChat: (chatId: string, updatedChat: Partial<ChatWithRelations>) => void;
  updateMessage: (
    chatId: string,
    messageId: string,
    updatedMessage: MessageWithRelations
  ) => void;
  getMessage: (
    chatId: string,
    messageId: string
  ) => MessageWithRelations | undefined;
  deleteChat: (chatId: string) => void;
  deleteAllChats: () => void;
  setChats: (chats: ChatWithRelations[]) => void;
};

export const useChatStore = create<ChatsStore>()(
  persist(
    (set, get) => ({
      chats: [],

      deleteChat: (chatId: string) => {
        set({ chats: get().chats.filter((chat) => chat.id !== chatId) });
      },

      deleteAllChats: () => {
        set({ chats: [] });
      },

      setChats: (chats: ChatWithRelations[]) => {
        set({ chats });
      },

      addChat: (chat: ChatWithRelations) => {
        console.log("[ADD::CHAT::STORE]", chat);
        set({ chats: [...get().chats, chat] });
      },

      getChatMessages: (chatId: string) =>
        get().chats.find((chat) => chat.id === chatId)?.messages || [],

      addMessage: (chatId: string, message: MessageWithRelations) => {
        set({
          chats: get().chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: [...(chat.messages ?? []), message],
                  lastMessageText: message.text,
                  lastMessageId: message.id,
                  lastMessageTime: message.updatedAt,
                  lastMessageSenderId: message.senderId,
                  lastMessageStatus: message.status,
                }
              : chat
          ),
        });
      },

      updateMessage: (
        chatId: string,
        messageId: string,
        updatedMessage: MessageWithRelations
      ) => {
        set({
          chats: get().chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: chat.messages?.map((message) =>
                    message.id === messageId ? updatedMessage : message
                  ),
                }
              : chat
          ),
        });
      },

      getMessage: (chatId: string, messageId: string) =>
        get()
          .chats.find((chat) => chat.id === chatId)
          ?.messages?.find((message) => message.id === messageId),

      getChat: (chatId: string) =>
        get().chats.find((chat) => chat.id === chatId),

      updateChat: (chatId: string, updatedChat: Partial<ChatWithRelations>) => {
        set({
          chats: get().chats.map((chat) =>
            chat.id === chatId ? { ...chat, ...updatedChat } : chat
          ),
        });
      },
    }),
    {
      name: "chats-storage",
      storage: createJSONStorage(() => ({
        getItem: async (name: string) => {
          const value = await get(name);
          return value ?? null;
        },
        setItem: async (name: string, value: unknown) => {
          await set(name, value);
        },
        removeItem: async (name: string) => {
          await del(name);
        },
      })),
    }
  )
);
