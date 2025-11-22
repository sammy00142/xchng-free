import { adminDB } from "@/lib/utils/firebase-admin";
import * as webpush from "web-push";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/utils/firebase";

const vapidDetails = {
  subject: "mailto:djayableez@gmail.com",
  privateKey: process.env.VAPID_PRIVATE_KEY!,
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
};

export async function processUserNotification(
  userId: string,
  payload: unknown
) {
  const userDoc = await adminDB
    .collection("PushSubscriptions")
    .doc(userId)
    .get();

  if (!userDoc.exists) {
    console.log(`User ${userId} has no active subscription.`);
    return;
  }

  const subscription = userDoc.data()!.subscription as webpush.PushSubscription;

  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload), {
      vapidDetails,
    });
    console.log(`Notification sent to user ${userId}`);
  } catch (error) {
    console.error(`Failed to send notification to user ${userId}:`, error);
  }
}

export async function processAdminNotification(payload: unknown) {
  const q = query(collection(db, "Users"), where("role", "==", "admin"));
  const querySnapshot = await getDocs(q);
  const adminIds = querySnapshot.docs.map((doc) => doc.id);

  const subsData = await adminDB.collection("PushSubscriptions").get();
  const subscriptions = new Map<string, webpush.PushSubscription>();

  subsData.docs.forEach((doc) => {
    const data = doc.data();
    if (adminIds.includes(data.userId)) {
      subscriptions.set(data.userId, data.subscription);
    }
  });

  await Promise.all(
    adminIds.map((id) => {
      const subscription = subscriptions.get(id);
      if (subscription) {
        console.log("SENDING PUSH TO UID", id);
        return webpush
          .sendNotification(subscription, JSON.stringify(payload), {
            vapidDetails,
          })
          .catch((error) =>
            console.error(`Failed to send notification to admin ${id}:`, error)
          );
      }
    })
  );
}
