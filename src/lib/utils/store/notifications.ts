import { NotificationPreferencesType } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { create } from "zustand";

type State = {
  isSubscribed: boolean;
  subscriptionData: PushSubscription | null;
  notificationPermission: NotificationPermission | null;
  preferences: NotificationPreferencesType | null;
};

type Actions = {
  updateSubscriptionStatus: (val: boolean) => void;
  updateSubscriptionData: (data: PushSubscription | null) => void;
  updateNotificationPermission: (permission: NotificationPermission) => void;
  updatePreferences: (preferences: NotificationPreferencesType | null) => void;
};

export const useNotificationSubscription = create<State & Actions>((set) => ({
  isSubscribed: false,
  subscriptionData: null,
  notificationPermission: null,
  preferences: null,
  updateSubscriptionStatus(val) {
    set({
      isSubscribed: val,
    });
  },
  updateSubscriptionData: (data: PushSubscription | null) => {
    set({ subscriptionData: data });
  },
  updateNotificationPermission(permission) {
    set({ notificationPermission: permission });
  },
  updatePreferences(preferences) {
    set({ preferences });
  },
}));

export const useNotificationStatus = () => {
  const { data } = api.notification.getNotificationStatus.useQuery();

  return {
    isSubscribed: data?.isSubscribed,
    preferences: data?.preferences,
  };
};
