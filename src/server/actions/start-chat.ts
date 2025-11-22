"use server";

import { api } from "@/trpc/server";
import { AssetType, ChatType } from "../db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { v4 } from "uuid";
import { sendNewChatNotification } from "@/lib/twillio";
import { sendSMSNotification } from "@/lib/termii";
import { sendNotificationToAdmin } from "@/lib/utils/sendNotification";

const currenciesSymbol = {
  USD: "$",
  NGN: "₦",
  EUR: "€",
  GBP: "£",
  AUD: "A$",
  CAD: "C$",
  JPY: "¥",
};

export const startChat = async ({
  type,
  assetId,
  amountInCurrency,
  currency,
  assetName,
  assetType,
}: {
  type: ChatType;
  assetId: string;
  amountInCurrency: string;
  currency: "NGN" | "USD" | "EUR" | "GBP" | "AUD" | "CAD" | "JPY";
  assetName: string;
  assetType: AssetType;
}) => {
  const user = await currentUser();
  if (!user) {
    return { error: "User not found", data: null };
  }

  const chatId = v4();
  const userId = user.id;
  try {
    const newChat = await api.chat.create({
      type,
      assetId,
      userId,
      chatId,
    });
    if (newChat.data === null) {
      return { error: "Failed to start chat", data: null };
    }

    await api.trade.create({
      userId,
      assetId,
      amountInCurrency,
      currency,
      chatId: newChat.data.id,
    });

    const text = `New trade request - ${assetName} ${
      assetType === "GIFTCARD" ? "Gift Card" : "Crypto"
    } worth ${currenciesSymbol[currency]}${amountInCurrency} from ${
      user.username
        ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
        : "User"
    }`;

    const url = `${process.env.NEXT_PUBLIC_APP_URL}/admin/chat/${newChat.data.id}`;

    try {
      await fetch("https://v3.api.termii.com/api/sms/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: process.env.TERMII_API_KEY,
          to: ["2348052555161", "+2348103418286"],
          from: "Greatxchng",
          sms: text,
          type: "plain",
          channel: "generic",
        }),
      });
    } catch (error) {
      console.error("error sending a notification");
    }

    return { data: newChat, error: null };
  } catch (error) {
    console.error("[SERVER_ACTION_ERROR]:[START_CHAT]", error);
    return { error: "Failed to start chat", data: null };
  }
};
