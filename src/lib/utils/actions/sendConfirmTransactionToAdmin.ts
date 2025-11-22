"use server";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "../firebase"; // Importing the firebase instance
import {
  Conversation,
  MediaContent,
  Sender,
  ReadReceipt,
} from "../../../../chat"; // Importing the Conversation type
import { timeStamper } from "../timeStamper"; // Importing the timeStamper utility
import { cookies } from "next/headers";
import { sendNotificationToUser } from "../sendNotification";

// Importing necessary modules from firebase/firestore and firebase/auth

// This function is used to send a confirmation of a transaction to the admin
export const sendConfirmTransactionToAdmin = async (
  id: string, // The ID of the message
  isAccepted: boolean, // Whether the transaction is accepted or not
  idx?: number // Optional index of the message
) => {
  try {
    // Creating a reference to the document in the 'Messages' collection with the given ID
    const chatDocRef = doc(
      db,
      process.env.NODE_ENV === "development" ? "test-Messages" : "Messages",
      id as string
    );

    // Getting the user from the cookies
    const cachedUser = cookies().get("user")?.value;
    const user = cachedUser ? (JSON.parse(cachedUser) as User) : null;

    console.log("USER", user);

    // If the user is not found, return an error message
    if (!user) return { message: "User not found", success: false };

    // Fetching the document snapshot from the Firestore
    const docSnapshot = await getDoc(chatDocRef);
    // Getting the data from the document snapshot and casting it to Conversation type
    const data = docSnapshot.data() as Conversation;

    // If no data is found, return an error message
    if (!data) return { message: "No data found", success: false };

    // Finding the index of the message with the title 'start_transaction'
    const index =
      idx ||
      data.messages.findLastIndex(
        (msg) => msg.card.title === "start_transaction"
      );

    // Getting the current timeStamp
    const time = timeStamper();

    // Setting the status based on whether the transaction is accepted or not
    const status = isAccepted ? "accepted_by_user" : "rejected_by_user";
    const transactionStatus = isAccepted ? "processing" : "rejected";
    const transactionAccepted = isAccepted ? true : false;

    if (data) {
      const obj = {
        ...data.messages[index],
        id: data.messages[index]?.id as string,
        type: data.messages[index]?.type as string,
        deleted: data.messages[index]?.deleted as boolean,
        content:
          (data.messages[index]?.content as {
            text: string;
            media: MediaContent;
            url: string;
            caption: string;
          }) || null,
        recipient: data.messages[index]?.recipient as string,
        sender: data.messages[index]?.sender as Sender,
        read_receipt: data.messages[index]?.read_receipt as ReadReceipt,
        status: status,
        card: {
          title: data.messages[index]?.card.title as string,
          data: {
            ...data.messages[index]?.card.data,
            status: status,
          },
        },
        edited: true,
        edited_at: time,
        timeStamp: time,
      };
      // Updating the message at the found index
      data.messages[index] = obj;
    }

    console.log("UPDATE DATA:", {
      messages: data.messages,
      "lastMessage.read_receipt": {
        delivery_status: "seen",
        status: true,
      },
      updated_at: time,
      "transaction.status": transactionStatus,
      "transaction.accepted": transactionAccepted,
    });

    // Updating the document in the Firestore with the new data
    await updateDoc(chatDocRef, {
      messages: data.messages,
      "lastMessage.read_receipt": {
        delivery_status: "seen",
        status: true,
      },
      updated_at: time,
      "transaction.status": transactionStatus,
      "transaction.accepted": transactionAccepted,
    });

    await sendNotificationToUser(user.uid, {
      title: `${data.transaction.cardDetails.name} Card - ${
        isAccepted ? "Accepted" : "Rejected"
      }`,
      body: `Your transactionhas been ${
        isAccepted ? "completed" : "rejected"
      } `,
      url: `https://greatexchange.co/chat/${id}`,
    });

    // Returning a success message
    return {
      success: true,
      message: `Transaction ${isAccepted ? "accepted" : "rejected"}`,
    };
  } catch (error) {
    // Logging the error and returning an error message
    console.error(error);
    return {
      message: "No data found",
      success: false,
    };
  }
};
