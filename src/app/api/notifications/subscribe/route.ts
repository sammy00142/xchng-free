import { adminDB } from "@/lib/utils/firebase-admin";
import { NextRequest, NextResponse } from "next/server";
import * as webpush from "web-push";

const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY!;

webpush.setVapidDetails(
  "mailto:djayableez@gmail.com",
  publicVapidKey,
  privateVapidKey
);

export const POST = async (request: NextRequest) => {
  const { subscription, userId, preferences, resubscribing } =
    await request.json();

  try {
    if (preferences) {
      await adminDB.collection("Users").doc(userId).update({
        preferences,
      });
    }

    await adminDB.collection("PushSubscriptions").doc(userId).set({
      subscription,
      userId,
    });

    if (!resubscribing) {
      webpush.sendNotification(
        subscription,
        JSON.stringify({
          title: "Heads Up!",
          body: "This how notifications will be sent",
          icon: "/greatexc.svg",
          data: {
            url: "https://greatexchange.co/",
            someData: "From Great Exchange",
          },
        })
      );
    }

    return NextResponse.json(
      { message: "Subscription saved successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error sending push notification", error);
    return NextResponse.json(
      { error: "Failed to send push notification" },
      { status: 500 }
    );
  }
};
