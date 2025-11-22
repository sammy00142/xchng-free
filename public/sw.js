let NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const API_URL = self.location.origin;

console.log("API_URL:", API_URL);

// Install Service Worker
self.addEventListener("install", async (event) => {
  event.waitUntil(
    fetch(`${API_URL}/api/env-config`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((config) => {
        console.log("Received config:", config);
        if (!config.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
          throw new Error(
            "NEXT_PUBLIC_VAPID_PUBLIC_KEY is missing from config"
          );
        }
        NEXT_PUBLIC_VAPID_PUBLIC_KEY = config.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        console.log("VAPID key set:", NEXT_PUBLIC_VAPID_PUBLIC_KEY);
      })
      .catch((error) => {
        console.error("Failed to fetch VAPID key:", error);
      })
  );

  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      cache.addAll(assets);
    })
  );
});

let lastNotification = null;

self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();

    event.waitUntil(
      (async () => {
        try {
          console.log("Push event received:", data);

          // Store the last notification
          lastNotification = {
            data: data,
            timeStamp: Date.now(),
          };

          // Check if resubscription is needed
          const subscription =
            await self.registration.pushManager.getSubscription();
          if (!subscription) {
            console.log("Subscription not found, resubscribing...");
            await resubscribeToPush(data.data.userId);
          } else {
            console.log("Subscription is still valid");
          }

          // Get all clients
          const clients = await self.clients.matchAll({ type: "window" });

          if (clients.length > 0) {
            // Sort clients by last focused time
            clients.sort((a, b) => b.lastFocusTime - a.lastFocusTime);

            // Send message to the most recently focused client
            await self.registration.showNotification(data.title, {
              body: data.body,
              icon: data.icon,
              data: data.data,
            });
            await clients[0].postMessage({
              type: "PUSH_RECEIVED",
              data: data,
            });
          } else {
            console.log(
              "No clients found, showing notification from service worker"
            );
            // If no clients are available, show notification from service worker
            await self.registration.showNotification(data.title, {
              body: data.body,
              icon: data.icon,
              data: data.data,
            });
          }
        } catch (error) {
          console.error("Detailed push event error:", {
            message: error.message,
            stack: error.stack,
            cause: error.cause,
          });
        }
      })()
    );
  } else {
    console.log("This push event has no data.");
  }
});

// notification click event listener
self.addEventListener("notificationclick", function (event) {
  console.log("Notification click Received.");
  event.notification.close();

  // Check if the clicked notification has a URL in its data
  if (event.notification.data && event.notification.data.url) {
    console.log("URL found in notification data:", event.notification.data.url);

    event.waitUntil(clients.openWindow(event.notification.data.url));
  } else {
    console.log("No URL found in notification data");
  }
});

// Listen for messages from clients
self.addEventListener("message", (event) => {
  // Verify the message origin matches our API_URL
  if (new URL(event.origin).origin !== new URL(API_URL).origin) {
    console.error("Received message from unauthorized origin:", event.origin);
    return;
  }

  if (event.data && event.data.type === "GET_LAST_NOTIFICATION") {
    if (lastNotification && Date.now() - lastNotification.timeStamp < 30000) {
      // Only send if the notification is less than 30 seconds old
      event.source.postMessage({
        type: "LAST_NOTIFICATION",
        data: lastNotification.data,
      });
      lastNotification = null; // Clear the stored notification
    }
  }
});
async function resubscribeToPush(userId) {
  if (!NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
    console.error("VAPID key is not set. Fetching it now.");
    try {
      const response = await fetch(`${API_URL}/api/env-config`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const config = await response.json();
      console.log("Received config:", config);
      if (!config.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
        throw new Error("NEXT_PUBLIC_VAPID_PUBLIC_KEY is missing from config");
      }
      NEXT_PUBLIC_VAPID_PUBLIC_KEY = config.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      console.log("VAPID key fetched:", NEXT_PUBLIC_VAPID_PUBLIC_KEY);
    } catch (error) {
      console.error("Failed to fetch VAPID key:", error);
      throw new Error("Unable to fetch VAPID key");
    }
  }

  try {
    const subscription = await self.registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
    }

    const applicationServerKey = urlBase64ToUint8Array(
      NEXT_PUBLIC_VAPID_PUBLIC_KEY
    );

    const newSubscription = await self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey,
    });

    console.log("Resubscribed to push notifications:", newSubscription);

    // Send new subscription details to your server
    await fetch(`${API_URL}/api/notifications/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        subscription: newSubscription,
        resubscribing: true,
      }),
    });

    console.log("Subscription details sent to server");
  } catch (error) {
    console.error("Failed to resubscribe:", error);
    throw error;
  }
}

// Helper function to convert base64 to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Helper function for base64 decoding
function atob(input) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let str = input.replace(/=+$/, '');
  let output = '';

  if (str.length % 4 == 1) {
    throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
  }

  // Refactored loop for better readability and proper counter usage
  for (let i = 0; i < str.length; i += 4) {
    const n1 = chars.indexOf(str[i]);
    const n2 = chars.indexOf(str[i + 1]);
    const n3 = chars.indexOf(str[i + 2]);
    const n4 = chars.indexOf(str[i + 3]);

    output += String.fromCharCode(
      (n1 << 2) | (n2 >> 4),
      ((n2 & 15) << 4) | (n3 >> 2),
      ((n3 & 3) << 6) | n4
    );
  }

  // Remove padding characters
  return output.replace(/\0+$/, '');
}
