"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { ArrowLeft, Bell, BellOff, Settings2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SunIcon } from "@radix-ui/react-icons";
import Loading from "@/app/loading";
import { api } from "@/trpc/react";
import {
  AlertDialogCancel,
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { env } from "@/env";
import { Switch } from "@/components/ui/switch";

const notificationTypes = [
  { id: "message", label: "Chat Messages" },
  { id: "updates", label: "Promotions & Deals" },
  { id: "reminders", label: "Reminders" },
  { id: "account", label: "Account Alerts" },
];

export default function PushNotificationManager() {
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [permissionStatus, setPermissionStatus] = useState("default");
  const [subscribing, setSubscribing] = useState(false);
  const router = useRouter();
  const [isSubscribed, setIsSubscribed] = useState(false);

  const {
    data: preferences,
    isLoading,
    refetch,
  } = api.notification.getNotificationPreferences.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    initialData: () => {
      const cached =
        typeof window !== "undefined"
          ? localStorage.getItem("notificationPreferences")
          : undefined;
      return cached ? JSON.parse(cached) : undefined;
    },
  });

  useEffect(() => {
    if (preferences && typeof window !== "undefined") {
      localStorage.setItem(
        "notificationPreferences",
        JSON.stringify(preferences)
      );
    }
  }, [preferences]);

  const { mutate: subscribe } =
    api.notification.subscribeToNotifications.useMutation({
      onSuccess: () => {
        // isSubscribed(true);
        refetch();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const { mutate: unsubscribe } =
    api.notification.unsubscribeFromNotifications.useMutation({
      onSuccess: () => {
        // isSubscribed(false);
        setSubscription(null);
        setIsSubscribed(false);

        refetch();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  const { mutate: updatePreferences } =
    api.notification.updateNotificationPreferences.useMutation({
      onSuccess: () => {
        refetch();
      },
    });

  const requestNotificationPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications.");
      toast.error("This browser does not support notifications.");
      return "denied";
    }

    const permission = await Notification.requestPermission();
    setPermissionStatus(permission);
    return permission;
  }, []);

  const subscribeUser = useCallback(async () => {
    if (!navigator.serviceWorker) return;

    setSubscribing(true);
    try {
      const permission = await requestNotificationPermission();

      if (permission === "granted") {
        const registration = await navigator.serviceWorker.ready;

        // Unsubscribe from any existing subscription first
        const existingSubscription =
          await registration.pushManager.getSubscription();
        if (existingSubscription) {
          await existingSubscription.unsubscribe();
        }

        const newSubscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        });

        const auth = newSubscription.getKey("auth");
        const p256dh = newSubscription.getKey("p256dh");

        subscribe({
          subscription: {
            endpoint: newSubscription.endpoint,
            auth: auth ? Buffer.from(auth).toString("base64") : "",
            p256dh: p256dh ? Buffer.from(p256dh).toString("base64") : "",
            expirationTime: newSubscription.expirationTime
              ? new Date(newSubscription.expirationTime)
              : undefined,
          },
        });
        setSubscription(newSubscription);
        setIsSubscribed(true);
      } else {
        toast.error("Notification permissions denied");
        setIsSubscribed(false);
      }
    } catch (err) {
      console.error("Failed to subscribe:", err);
      toast.error("Failed to subscribe to notifications");
      setIsSubscribed(false);
    } finally {
      setSubscribing(false);
    }
  }, [requestNotificationPermission, subscribe]);

  const checkSubscription = useCallback(async () => {
    if (!("serviceWorker" in navigator)) {
      console.log("Service Worker not supported");
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription =
        await registration.pushManager.getSubscription();

      // Update states based on current subscription
      setIsSubscribed(!!existingSubscription);
      setSubscription(existingSubscription);
      setPermissionStatus(Notification.permission);

      // Auto-resubscribe logic
      if (Notification.permission === "granted") {
        // Case 1: No subscription exists
        if (!existingSubscription) {
          console.log("No subscription found, resubscribing...");
          await subscribeUser();
          return;
        }

        // Case 2: Subscription is expired or will expire soon
        if (existingSubscription.expirationTime) {
          const expirationTime = new Date(
            existingSubscription.expirationTime
          ).getTime();
          const now = new Date().getTime();
          const timeUntilExpiration = expirationTime - now;

          // Resubscribe if expired or will expire in the next hour
          if (timeUntilExpiration < 1000 * 60 * 60) {
            console.log(
              "Subscription expired or expiring soon, resubscribing..."
            );
            await existingSubscription.unsubscribe();
            await subscribeUser();
          }
        }
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
      toast.error("Failed to check notification subscription status");
    }
  }, [subscribeUser]);

  // Add new effect to check subscription status on mount
  useEffect(() => {
    checkSubscription();

    // Set up periodic subscription checks
    const checkInterval = setInterval(checkSubscription, 1000 * 60 * 60); // Check every hour

    return () => clearInterval(checkInterval);
  }, [checkSubscription]);

  const unsubscribeUser = useCallback(async () => {
    try {
      if (subscription) {
        await subscription.unsubscribe();
      }

      if (navigator.serviceWorker) {
        const registration = await navigator.serviceWorker.ready;
        const existingSubscription =
          await registration.pushManager.getSubscription();
        if (existingSubscription) {
          await existingSubscription.unsubscribe();
        }
      }

      unsubscribe();
    } catch (err) {
      console.error("Error unsubscribing:", err);
      toast.error("Failed to unsubscribe from notifications");
    }
  }, [subscription, unsubscribe]);

  const handlePreferenceChange = async (typeId: string, enabled: boolean) => {
    if (!preferences?.preferences) return;

    const newPreferences = {
      ...preferences.preferences,
      [typeId]: enabled,
    };

    updatePreferences({
      preferences: newPreferences,
      isSubscribed: isSubscribed,
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="h-screen grid place-items-start">
      <div className="w-full max-w-md mx-auto">
        <div className="flex items-center justify-start gap-4 p-4 bg-white/90 dark:bg-neutral-900 backdrop-blur-xl sticky top-0">
          <Button
            variant={"outline"}
            size={"icon"}
            onClick={() => {
              router.back();
            }}
          >
            <ArrowLeft size={20} />
          </Button>
          <h4 className="font-semibold text-xl">Notifications</h4>
        </div>

        <CardHeader>
          <CardDescription>
            Manage your notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {permissionStatus === "denied" && (
            <Alert variant="destructive">
              <AlertTitle>Notifications Blocked</AlertTitle>
              <AlertDescription>
                You have blocked notifications. Please enable them in your
                browser settings to receive updates.
              </AlertDescription>
            </Alert>
          )}
          {!isSubscribed && (
            <div className="grid grid-flow-row place-items-center border border-pink-100 gap-4 px-4 py-6 bg-pink-50 dark:bg-pink-600/10 rounded-2xl">
              <h4 className="font-medium text-base text-center">
                {isSubscribed
                  ? "Subscribed"
                  : "Subscribe to receive notifications"}
              </h4>
              <Button
                onClick={isSubscribed ? unsubscribeUser : subscribeUser}
                disabled={subscribing}
                variant={isSubscribed ? "destructive" : "default"}
                className="w-full py-6"
              >
                {subscribing ? (
                  <SunIcon width={18} className="animate-spin mr-2" />
                ) : (
                  <>
                    {isSubscribed ? (
                      <BellOff className="mr-2 h-4 w-4" />
                    ) : (
                      <Bell className="mr-2 h-4 w-4" />
                    )}
                  </>
                )}

                {isSubscribed ? "Unsubscribe" : "Subscribe"}
              </Button>
            </div>
          )}

          <div className={`${!isSubscribed && "opacity-50"}`}>
            <div className="w-full flex align-middle place-items-center gap-2 py-4">
              <Settings2 className="mr-1 h-5 w-5" />
              <h4 className="font-semibold text-base">Preferences</h4>
            </div>
            <div className="space-y-2 mt-2">
              {notificationTypes.map((type) => (
                <div
                  key={type.id}
                  className="flex items-center justify-between py-1.5"
                >
                  <span>{type.label}</span>
                  <Switch
                    disabled={!isSubscribed}
                    checked={preferences?.preferences?.[type.id] ?? false}
                    onCheckedChange={(enabled) =>
                      handlePreferenceChange(type.id, enabled)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="text-sm text-gray-500">
          You can change these settings at any time.
        </CardFooter>

        {isSubscribed && (
          <div className="w-full grid place-items-center mt-8">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant={"outline"}
                  className="text-red-500 py-6 mx-auto border-none shadow-none"
                >
                  <BellOff className="mr-2 h-4 w-4" />
                  Unsubscribe from notifications
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogTitle>Heads Up!</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to stop receiving notifications?
                </AlertDialogDescription>
                <div className="flex md:flex-row flex-col md:items-center md:justify-end place-items-center justify-center">
                  <AlertDialogCancel asChild>
                    <Button
                      className="w-full py-6"
                      onClick={unsubscribeUser}
                      variant={"outline"}
                    >
                      Yes, Unsubscribe
                    </Button>
                  </AlertDialogCancel>
                  <AlertDialogCancel asChild>
                    <Button
                      className="w-full text-primary py-6"
                      variant={"default"}
                    >
                      Cancel
                    </Button>
                  </AlertDialogCancel>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </div>
  );
}
