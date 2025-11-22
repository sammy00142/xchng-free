"use server";

import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { cookies } from "next/headers";
import type { User } from "firebase/auth";

export const sendReport = async (e: FormData) => {
  const obj = Object.fromEntries(e.entries()) as {
    reason: string;
    name: string;
    email: string;
    phoneNumber: string;
    message: string;
    transactionId?: string;
  };

  const cachedUser = cookies().get("user")?.value;
  const user = cachedUser ? (JSON.parse(cachedUser) as User) : null;

  try {
    const transactionRef = doc(db, "Transactions", obj.transactionId as string);
    const getTransaction = await getDoc(transactionRef);

    if (!getTransaction.exists()) {
      return {
        message:
          "Transaction not found. You can not report a non-existent transaction.",
        success: false,
      };
    }

    const transaction = getTransaction.data();

    const ref = collection(db, "Reports");
    await addDoc(ref, {
      type: obj.reason === "transactional" ? "report" : "feedback",
      cause: obj.reason,
      details: {
        subject: `A ${obj.reason} report`,
        body: obj.message,
      },
      date: new Date(),
      user: {
        uid: user?.uid || "Anonymous",
        username: user?.displayName || obj.name || "Anonymous",
        email: user?.email || obj.email || "Anonymous",
      },
      read: false,
      transactionId: obj.transactionId || getTransaction.id,
    });

    return {
      message: "Sent successfully!",
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      message: "Its not you, its us. Please try again.",
      success: false,
    };
  }
};

export const sendSupportMessage = async (e: FormData) => {};
