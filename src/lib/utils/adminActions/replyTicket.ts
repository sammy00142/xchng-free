import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export const replyTicket = async (id: string, e: FormData) => {
  try {
    const message = e.get("message");

    if (message?.toString().trim().length === 0)
      return {
        success: false,
      };

    const date = new Date();
    const ticketRef = doc(db, "Tickets", id);
    await updateDoc(ticketRef, {
      updated_at: date,
      status: {
        seen: true,
        addressed: true,
        seen_at: date,
        addressed_at: date,
      },
      adminReply: arrayUnion({
        message: e.get("message"),
        date: date,
      }),
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("ADMIN REPLY TICKET ERROR: ", error);
    return {
      success: false,
    };
  }
};

export const seenTicket = async (id: string) => {
  try {
    const date = new Date();

    const ticketRef = doc(db, "Tickets", id);
    await updateDoc(ticketRef, {
      status: {
        addressed: true,
        addressed_at: date,
        seen: true,
        seen_at: date,
      },
    });
  } catch (error) {
    console.error("CHANGE TICKET TO SEEN ERROR: ", error);
  }
};
