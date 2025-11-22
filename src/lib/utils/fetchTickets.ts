"use server";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/utils/firebase";

export async function getTickets() {
  try {
    const reportsRef = collection(db, "Tickets");

    const snap = await getDocs(reportsRef);

    const fetchedReports = await Promise.all(
      snap.docs.map(async (doc) => ({
        ...JSON.parse(JSON.stringify(doc.data())),
        id: doc.id,
      }))
    );

    if (fetchedReports.length === 0) {
      return {
        message: "No reports found",
        success: false,
        data: null,
      };
    }

    return {
      message: "Reports fetched successfully",
      success: true,
      data: fetchedReports,
    };
  } catch (error) {
    console.error("ERROR FETCHING REPORTS: ", error);
  }
}

export async function getFeedbacks() {
  try {
    const reportsRef = query(
      collection(db, "Reports"),
      where("type", "==", "feedback")
    );

    const snap = await getDocs(reportsRef);

    const fetchedReports = await Promise.all(
      snap.docs.map(async (doc) => ({
        ...JSON.parse(JSON.stringify(doc.data())),
        id: doc.id,
      }))
    );

    if (fetchedReports.length === 0) {
      return {
        message: "No reports found",
        success: false,
        data: null,
      };
    }

    return {
      message: "Reports fetched successfully",
      success: true,
      data: fetchedReports,
    };
  } catch (error) {
    console.error("ERROR FETCHING REPORTS: ", error);
  }
}
