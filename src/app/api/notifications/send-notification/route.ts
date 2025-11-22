import { NextResponse } from "next/server";
import { queue } from '@/lib/utils/notificationQueue';

export const POST = async (request: Request) => {
  try {
    const notificationData = await request.json();
    await queue.add('sendNotification', notificationData);
    return NextResponse.json({ message: "Notification queued successfully" }, { status: 200 });
  } catch (error) {
    console.error("[SEND NOTIFICATION]: Error queuing notification", error);
    return NextResponse.json({ error: "Failed to queue notification" }, { status: 500 });
  }
};
