"use server";

import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  Conversation,
  MediaContent,
  ReadReceipt,
  Sender,
} from "../../../../chat";
import { v4 } from "uuid";
import { checkServerAdmin } from "./checkServerAdmin";
import { timeStamper } from "../timeStamper";
import { checkIsAdmin } from "./checkAdmin";

export const setCardRate = async (
  id: string,
  e: FormData,
  edit?: boolean,
  idx?: number
) => {
  try {
    const rate = e.get("rate");

    const user = await checkIsAdmin();

    console.log("USER", user);

    if (!user?.isAdmin)
      return {
        message: "Not Allowed. User is not an admin",
        success: false,
      };

    const chatDocRef = doc(
      db,
      process.env.NODE_ENV === "development" ? "test-Messages" : "Messages",
      id as string
    );

    const docSnapshot = await getDoc(chatDocRef);
    const data = docSnapshot.data() as Conversation;

    await updateDoc(chatDocRef, {
      "lastMessage.read_receipt": {
        delivery_status: "seen",
        status: true,
      },
      updated_at: new Date(),
      "transaction.cardDetails.rate": rate,
    });

    if (!edit) {
      const msg = {
        id: v4(),
        timeStamp: new Date(),
      };

      const userData = JSON.parse(user.user);

      await updateDoc(chatDocRef, {
        lastMessage: {
          id: msg.id,
          content: {
            text: "Card Rate",
            media: false,
          },
          read_receipt: {
            delivery_status: "sent",
            status: false,
            time: new Date(), // date_replaced,
          },
        },
        messages: arrayUnion({
          id: msg.id,
          type: "card",
          deleted: false,
          sender: {
            username: userData.displayName,
            uid: userData.uid,
          },
          recipient: "user",
          card: {
            title: "rate",
            data: {
              value: rate,
            },
          },
          timeStamp: new Date(), // date_replaced,
          edited: false,
          read_receipt: {
            delivery_status: "sent",
            status: false,
            time: new Date(), // date_replaced,
          },
        }),
        updated_at: new Date(), // date_replaced,
      });
    } else {
      if (data) {
        const index =
          idx ||
          data.messages.findLastIndex((msg) => msg.card.title === "rate");

        const time = timeStamper();
        if (Array.isArray(data.messages)) {
          data.messages[index] = {
            ...data.messages[index],
            id: data.messages[index]?.id as string,
            type: data.messages[index]?.id as string,
            deleted: data.messages[index]?.deleted as boolean,
            content: data.messages[index]?.content as {
              text: string;
              media: MediaContent;
              url: string;
              caption: string;
            },
            recipient: data.messages[index]?.recipient as string,
            sender: data.messages[index]?.sender as Sender,
            read_receipt: data.messages[index]?.read_receipt as ReadReceipt,
            // status: data.messages[index]?.status as boolean,
            card: {
              title: "rate",
              data: {
                value: rate,
              },
            },
            edited: true,
            edited_at: time,
            timeStamp: time,
          };

          await updateDoc(chatDocRef, {
            messages: data.messages,
            updated_at: time,
          });
        }
      }
    }
    return {
      message: "Rate sent to successfully",
      success: true,
    };
  } catch (error) {
    console.log("SEND_RATE", error);
    return {
      message: "Internal error. Rate not sent",
      success: false,
    };
  }
};
