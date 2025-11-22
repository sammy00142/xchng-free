"use server";

import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "./firebase";
import { UserRecord } from "firebase-admin/auth";
import type { Conversation } from "../../../chat";
import { getUserCookie } from "./getUserCookie";
import { redirect } from "next/navigation";

export const getUserChats = async () => {
  const uc = (await getUserCookie()) as string;

  try {
    if (!uc) {
      redirect("/sell");
    }

    const cachedUser = JSON.parse(uc) as UserRecord;

    const chatsRef = query(
      collection(
        db,
        process.env.NODE_ENV === "development" ? "test-Messages" : "Messages"
      ),
      where("user.uid", "==", cachedUser.uid),
      orderBy("updated_at", "desc")
    );
    const chats = await getDocs(chatsRef);

    const userChats = chats.docs.map((doc) => {
      return {
        data: JSON.parse(JSON.stringify(doc.data())) as Conversation,
        id: doc.id,
      };
    });

    if (!chats.empty) {
      return {
        message: "Chats fetched successfully",
        success: true,
        data: userChats as { data: Conversation; id: string }[],
      };
    } else {
      return {
        message: "Could not fetch chats",
        success: false,
        data: [],
      };
    }
  } catch (error) {
    console.error("GET USER CHATS: ", error);

    return {
      message: "An Internal error occured",
      success: false,
      data: null,
    };
  }
};
