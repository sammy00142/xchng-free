import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { FirebaseError } from "firebase/app";

export const fetchTicketData = async (id: string) => {
  try {
    const ticketsRef = doc(db, "Tickets", id);

    const data = await getDoc(ticketsRef);

    if (data.exists()) {
      return {
        message: "Ticket data fetched successfully",
        data: data.data(),
        success: true,
      };
    } else {
      return {
        message: "Ticket was not found. It has probably been deleted.",
        data: null,
        success: false,
      };
    }
  } catch (error) {
    console.error("ERROR FETCHING TICKET DATA: ", error);
    const firebaseErr = error as FirebaseError;
    return {
      message: firebaseErr.message,
      data: null,
      success: false,
    };
  }
};
