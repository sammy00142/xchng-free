import { create } from "zustand";
import type { Conversation, Message } from "../../../../chat";
import { produce } from "immer";

type State = {
  conversation: Conversation | undefined;
};

type Actions = {
  addMessage: (message: Message) => void;
  updateConversation: (
    conversation: Conversation,
    scrollToBottom?: React.RefObject<HTMLDivElement>
  ) => void;
};

export const useMessagesStore = create<State & Actions>((set) => ({
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

  updateConversation: (
    conversation,
    scrollToBottom?: React.RefObject<HTMLDivElement>
  ) => {
    if (scrollToBottom && scrollToBottom.current) {
      scrollToBottom.current.lastElementChild?.scrollIntoView({
        behavior: "smooth",
      });
    }

    set({ conversation });
  },
}));
