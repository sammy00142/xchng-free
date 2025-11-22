import { collection, getDocs, query, where } from "firebase/firestore";
import Cookies from "js-cookie";
import { db } from "../firebase";
import { TicketsData } from "../../../../types";
import { getUserCookie } from "../getUserCookie";

export const getUserTickets = async () => {
  const u = await getUserCookie();

  if (!u) {
    return {
      message: "Sign in to view tickets",
      success: false,
      data: null,
    };
  }

  try {
    const user = JSON.parse(u);

    const ticketsRef = query(
      collection(db, "Tickets"),
      where("user.id", "==", user.uid)
    );

    const tickets = await getDocs(ticketsRef);

    if (!tickets.empty) {
      return {
        message: "Tickets fetched.",
        data: tickets.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as TicketsData[],
        success: true,
      };
    }

    return {
      message: "No tickets found",
      success: false,
      data: null,
    };
  } catch (error) {
    console.error("GET USER TICKETS: ", error);
    return {
      message: "An internal error occured. Please refresh the page",
      success: false,
      data: null,
    };
  }
};
