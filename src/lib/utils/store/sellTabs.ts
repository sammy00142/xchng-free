import { create } from "zustand";

type State = {
  tab: string;
};

type Action = {
  updateTab: (tabId: string) => void;
};

export const useSellTab = create<State & Action>((set) => ({
  tab: "",
  updateTab: (tabId: string) => set({ tab: tabId }),
}));
