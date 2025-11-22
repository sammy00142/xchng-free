"use server";

import { UserRecord } from "firebase-admin/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { TransactionRec } from "../../../chat";
import { db } from "./firebase";
import { getUserCookie } from "./getUserCookie";

export async function getUserTransactions() {
  const uc = (await getUserCookie()) as string;

  try {
    if (!uc) {
      return {
        message: "You are not logged in! UC",
        success: false,
        data: null,
      };
    }

    const cachedUser = JSON.parse(uc) as UserRecord;

    const transactionsRef = query(
      collection(db, "Transactions"),
      where("userId", "==", cachedUser.uid)
    );
    const transactions = await getDocs(transactionsRef);

    const userTransactions = transactions.docs.map((doc) => {
      return {
        ...(JSON.parse(JSON.stringify(doc.data())) as TransactionRec),
        id: doc.id,
      };
    });

    return {
      message: "Transactions fetched successfully",
      success: true,
      data: userTransactions,
    };
  } catch (error) {
    console.error("GET USER TRANSACTIONS: ", error);

    return {
      message: "An Internal error occured",
      success: false,
      data: null,
    };
  }
}
