import { create } from "zustand";
import type { Conversation, Message } from "../../../../chat";
import { produce } from "immer";

type State = {
  conversation: Conversation | undefined;
};

type Actions = {
  addMessage: (message: Message) => void;
  updateConversation: (conversation: Conversation) => void;
  updateMessage: (id: string, message: Message) => void;
};

export const adminCurrConversationStore = create<State & Actions>((set) => ({
  conversation: undefined,
  addMessage: (message) =>
    set(
      produce((draft) => {
        if (draft.conversation) {
          return {
            ...draft.conversation.messages,
            message,
          };
        } else {
          return message;
        }
      })
    ),

  updateConversation: (conversation) => {
    set({ conversation });
  },

  updateMessage: (id: string, message: Message) => {
    // const prev = get().conversation?.messages;

    set(
      produce((draft) => {
        if (draft.conversation) {
          const msgIdx = draft.conversation.messages.findIndex(
            (msg: { id: string }) => msg.id === id
          );

          const newMessages = {
            ...draft.conversation.messages.slice(0, msgIdx),
            message,
            ...draft.conversation.messages.slice(msgIdx + 1),
          };

          return {
            ...draft.conversation,
            messages: newMessages,
          };
        }
      })
    );
  },
}));
