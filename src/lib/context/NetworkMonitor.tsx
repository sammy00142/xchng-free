"use client";
import { postToast } from "@/components/postToast";
import { WifiIcon } from "@heroicons/react/24/outline";
import React, { ReactNode, useEffect, useState } from "react";

type Props = {
  children: ReactNode;
};

const NetworkMonitor = (props: Props) => {
  const [online, setOnline] = useState<boolean | null>();

  useEffect(() => {
    // Event listener for network status changes
    const handleOnline = () => {
      setOnline(true);
      console.log("You are now online.");
      postToast("You are back online", {
        icon: (
          <>
            <WifiIcon className="text-green-500" />
          </>
        ),
      });
    };

    const handleOffline = () => {
      console.log("You are now offline.");
      setOnline(false);
      postToast("No internet connection.", {
        icon: <>✖️</>,
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener(
        "offline",

        handleOffline
      );
    };
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("/networkSpeed.sw.js").then(
          function (registration) {
            // Registration was successful
            console.log(
              "ServiceWorker registration successful with scope: ",
              registration.scope
            );
          },
          function (err) {
            // registration failed :(
            console.log("ServiceWorker registration failed: ", err);
          }
        );
      });
    }
  }, []);

  return (
    <div>
      {online === false && (
        <div className="bg-red-500 p-1 text-center font-medium text-white sticky top-0 z-[99999999] text-[10px] w-full">
          No internet connection
        </div>
      )}
      {props.children}
    </div>
  );
};

export default NetworkMonitor;
