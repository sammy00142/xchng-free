import { create } from "zustand";
import { Preferences } from "../../../../types";

type State = {
  notificationPreferences: Preferences;
};

type Action = {
  setNotificationPreferences: (preferences: Partial<Preferences>) => void;
};

export const useNotificationPreferences = create<State & Action>((set) => ({
  notificationPreferences: {
    message: true,
    updates: true,
    reminders: true,
    account: true,
  },
  setNotificationPreferences: (notificationPreferences: Partial<Preferences>) =>
    set((state) => ({
      notificationPreferences: {
        ...state.notificationPreferences,
        ...notificationPreferences,
      },
    })),
}));
