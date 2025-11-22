"use server";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/utils/firebase";

export async function getUsers() {
  try {
    const usersRef = collection(db, "Users");
    const usersSnapshot = await getDocs(usersRef);

    const fetchTransactions = async (id: string) => {
      const transactionsSnapshot = query(
        collection(db, "Transactions"),
        where("userId", "==", id)
      );
      const snap = await getDocs(transactionsSnapshot);

      return snap.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
    };

    const fetchChats = async (id: string) => {
      const chatsSnapshot = query(
        collection(db, process.env.NODE_ENV === "development" ? "test-Messages" : "Messages"),
        where("user.uid", "==", id)
      );
      const snap = await getDocs(chatsSnapshot);

      return snap.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
    };

    const fetchedUsers = await Promise.all(
      usersSnapshot.docs.map(async (doc) => ({
        ...doc.data(),
        id: doc.id,
        transactions: await fetchTransactions(doc.id),
        chats: await fetchChats(doc.id),
      }))
    );

    return fetchedUsers;
  } catch (error) {
    console.error("ERROR FETCHING USERS: ", error);
  }
}
