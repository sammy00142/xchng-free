import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export const reopenChat = async (chatId: string) => {
  try {
    const time = new Date(); // replaced_date;
    const chatDocRef = doc(
      db,
      process.env.NODE_ENV === "development" ? "test-Messages" : "Messages",
      chatId
    );

    await updateDoc(chatDocRef, {
      "lastMessage.read_receipt": {
        delivery_status: "seen",
        status: true,
      },
      updated_at: time,
      chatStatus: "open",
    });

    return {
      message: 'Conversation status changed to "Open"',
      success: true,
    };
  } catch (error) {
    console.error("ERROR @@ reopenChat()", error);

    return {
      message: "Internal server error. Please try again",
      success: false,
    };
  }
};
