"use server";
import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";
import { cookies } from "next/headers";

const photoUrls = [
  "https://plus.unsplash.com/premium_photo-1696587025055-edee8ff58916?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE2fENEd3V3WEpBYkV3fHxlbnwwfHx8fHw%3D",
  "https://images.unsplash.com/photo-1691145445988-563240a2bb82?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDIwfENEd3V3WEpBYkV3fHxlbnwwfHx8fHw%3D",
  "https://images.unsplash.com/photo-1697215786004-682b1684c65e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE5fENEd3V3WEpBYkV3fHxlbnwwfHx8fHw%3D",
  "https://images.unsplash.com/photo-1699724684258-448f4b9baa38?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDMyfENEd3V3WEpBYkV3fHxlbnwwfHx8fHw%3D",
  "https://images.unsplash.com/photo-1700668497390-43014cf7a3b4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDM3fENEd3V3WEpBYkV3fHxlbnwwfHx8fHw%3D",
  "https://images.unsplash.com/photo-1666968881524-226746362f13?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDUzfENEd3V3WEpBYkV3fHxlbnwwfHx8fHw%3D",
  "https://images.unsplash.com/photo-1621246475596-153d9c743fa4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDUyfENEd3V3WEpBYkV3fHxlbnwwfHx8fHw%3D",
];

const reviewsTemp = [
  "E no bad, e no worse",
  "I juss manage am",
  "Issokay",
  "This na one correct!",
  "Love this! E choke die!",
];

export const reviewAction = async (stars: number, formData: FormData) => {
  const userFrCookie = cookies().get("user");
  const user = JSON.parse(userFrCookie?.value || "user");
  const review = formData.get("review");

  try {
    const reviewRef = collection(db, "Feedbacks");
    const reviewData = {
      approved: true,
      user: {
        username: user?.displayName || "Anonymous",
        photoUrl:
          user?.photoUrl ||
          photoUrls[Math.floor(Math.random() * photoUrls.length)],
        id: user?.uid || null,
      },
      content: {
        stars: stars,
        review: review === "" ? reviewsTemp[stars - 1] : review,
      },
      date: new Date(),
    };
    await addDoc(reviewRef, reviewData);

    return {
      sent: true,
      error: "",
    };
  } catch (error) {
    console.log("Error submitting review", error);
    return {
      sent: false,
      error: error,
    };
  }
};
