"use server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { sendNotificationToUser } from "../sendNotification";

const baseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.BASE_URL
    : "https://greatexchange.co";

export const sendImageA = async (formData: FormData) => {
  const uc = cookies().get("user")?.value;

  if (!uc) {
    return { success: false, message: "User not found" };
  }

  const user = JSON.parse(uc);

  try {
    const chatId = formData.get("chatId")?.toString();
    const metadata = JSON.parse(
      formData.get("metadata")?.toString() ?? "{}"
    ) as {
      type: string;
    };
    const image = formData.get("image") as unknown as File;

    const url = `/chatImages/${chatId}/greatexchange.co__${randomUUID()}__${
      image.name
    }__${user.uid}`;

    const res = await fetch(`${baseUrl}/api/sendimage`, {
      body: JSON.stringify({ image, metadata, url, uid: user.uid }),
      method: "POST",
    }).then((e) => e.json());

    await sendNotificationToUser(user.uid, {
      body: `Sent a picture`,
      title: user.displayName,
      url: `https://greatexchange.co/chat/${chatId}`,
    });

    return res;
  } catch (error) {
    console.error(error);

    return {
      message: "An error occured",
      success: false,
    };
  }
};
