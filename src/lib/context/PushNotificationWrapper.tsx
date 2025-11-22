"use client";
import { ReactNode, useEffect } from "react";
import { toast, Toaster } from "sonner";

const NotificationWrapper = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      // Listen for messages from the service worker
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data && event.data.type === "PUSH_RECEIVED") {
          const data = event.data.data;
          if (document.visibilityState === "visible") {
            toast(data.title, {
              position: "top-right",
              description: data.body,
              action: {
                label: "View",
                onClick: () => {
                  if (data.data?.url) {
                    window.open(data.data.url);
                  }
                },
              },
            });
          }
        }
      });
    }
  }, []);

  return (
    <>
      <Toaster />
      {children}
    </>
  );
};

export default NotificationWrapper;
