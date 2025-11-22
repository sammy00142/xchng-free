"use client";

import { useEffect } from "react";
// import runOneSignal from "./Onesignal";

const RequestNotification = () => {
  // Implement your logic here
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then(async (reg) => {
        const sub = await reg.pushManager.getSubscription();
        if (sub == undefined) {
          if (reg) {
            const sub = await reg.pushManager.subscribe({
              userVisibleOnly: true,
            });
            console.log(sub.toJSON());
          } else {
            console.log("sub", sub);
          }
        }
      });
    }
  }, []);

  return null;
};

export default RequestNotification;
