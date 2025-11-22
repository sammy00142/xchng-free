import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";
import type { Conversation } from "../../../chat";
import { getUserCookie } from "./getUserCookie";

export const getAdminChats = async () => {
  const uc = await getUserCookie();

  try {
    if (!uc) {
      return {
        message: "You are not logged in! UC",
        success: false,
        data: null,
      };
    }

    const chatsRef = query(
      collection(db, process.env.NODE_ENV === "development" ? "test-Messages" : "Messages"),
      orderBy("updated_at", "desc")
    );

    const chats = await getDocs(chatsRef);

    const userChats = chats.docs.map((doc) => {
      return {
        data: JSON.parse(JSON.stringify(doc.data())) as Conversation,
        id: doc.id,
      };
    });

    return {
      message: "Chats fetched successfully",
      success: true,
      data: userChats as { data: Conversation; id: string }[],
    };
  } catch (error) {
    console.error("GET ADMIN CHATS Error: ", error);

    return {
      message: "An Internal error occured",
      success: false,
      data: null,
    };
  }
};
