"use server";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import Cookies from "js-cookie";
import { db, storage } from "../firebase";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadString,
} from "firebase/storage";
import { objectToFile } from "../fileConverter";
import { v4 } from "uuid";
import { sendNotificationToAdmin } from "../sendNotification";
// import { sendNotification } from "../sendNotification";

export const submitTicket = async (
  ticketType: string,
  description: string,
  images: string,
  email: string,
  fullname: string
) => {
  const user = JSON.parse(Cookies.get("user") || "{}");
  let uid = user ? user.uid : "";
  let imagesUrl: string[] = [];

  const files = JSON.parse(images) as {
    data: string;
    name: string;
    type: string;
  }[];

  const uploadTasks = files.map(async (file) => {
    const toFile = objectToFile(file);
    const storageRef = ref(
      storage,
      `tickets/${fullname}__${v4()}__${file.name}`
    );
    const uploadProg = await uploadBytes(storageRef, toFile);

    const url = await getDownloadURL(uploadProg.ref);
    imagesUrl.push(url);
  });

  try {
    if (!user) {
      const userRef = query(
        collection(db, "Users"),
        where("email", "==", email)
      );
      const users = (await getDocs(userRef)).docs.map((e) => e.data());

      if (users.length > 0 && user[0].id) uid = users[0]?.id;
    }

    if (images) {
      await Promise.all(uploadTasks);
    }

    const date = new Date();

    const ticket = {
      content: {
        description: description,
        images: imagesUrl,
        type: ticketType,
      },
      date: date,
      status: {
        addressed: false,
        addressed_at: null,
        seen: false,
        seen_at: null,
      },
      user: {
        fullname: fullname,
        email: email,
        id: uid || null,
      },
    };

    const ticketsRef = collection(db, "Tickets");

    const save = await addDoc(ticketsRef, ticket);

    const ticketRef = doc(db, "Tickets", save.id);
    await updateDoc(ticketRef, {
      id: save.id,
    });

    if (uid) {
      const userRef = doc(db, "Users", uid);
      await updateDoc(userRef, {
        reports_reviews: arrayUnion(save.id),
      });
    }

    sendNotificationToAdmin({
      title: `${user.displayName} has a Complaint`,
      body: `a complaint has been made by ${
        user.displayName
      } on ${date.toLocaleDateString()}`,
      url: `https://greatexchange.co/support/ticket/${save.id}`,
    });

    return {
      message: "Ticket has been sent!",
      success: true,
    };
  } catch (error) {
    console.error("ERROR SUBMITTING TICKET", error);

    return {
      message: "An internal error occured",
      success: false,
    };
  }
};
