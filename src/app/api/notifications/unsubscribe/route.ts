import { adminDB } from "@/lib/utils/firebase-admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userId } = await request.json();

  try {
    await adminDB.collection("PushSubscriptions").doc(userId).delete();

    await adminDB.collection("Users").doc(userId).update({
      preferences: null,
    });

    return NextResponse.json(
      { message: "Unsubscribed successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error unsubscribing:", err);
    return NextResponse.json({ error: "Error unsubscribing" }, { status: 500 });
  }
}
