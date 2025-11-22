"use server";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { giftcards } from "../../../public/data/giftcards";
import { db } from "./firebase";
import { cookies } from "next/headers";
import { v4 as uuid } from "uuid";
import { GiftCard } from "../../../types";
import type { User } from "firebase/auth";
import type { Conversation } from "../../../chat";
import { queue } from "./notificationQueue";
import { sendNotificationToAdmin } from "./sendNotification";

export const getCardData = (id: string | undefined): GiftCard | null => {
  if (!id) {
    return null;
  }

  const data = giftcards.find((card) => {
    return card.id === id;
  });

  if (data) {
    return data;
  }

  return null;
};

export const startChat = async (data: GiftCard, formData: FormData) => {
  const cachedUser = cookies().get("user")?.value;
  const user = cachedUser ? (JSON.parse(cachedUser) as User) : null;

  if (!user) {
    return {
      link: "/",
      logged: false,
      error: "You must be logged in.",
      proceed: false,
    };
  }

  const price = formData.get("price");
  const subcategoryValue = formData.get("subcategory");

  // validate the above fields and return if they are empty or invalid
  if (!price || !subcategoryValue) {
    return {
      link: "/",
      logged: false,
      error: "Please fill in all fields.",
      proceed: false,
    };
  }

  const subcategoryData = data.subcategory.find(
    (c) => c.value === subcategoryValue
  );

  const cardInfo = {
    cardTitle: data.name,
    price: `$${price}`,
    subcategory: subcategoryData,
  };

  try {
    const msg = {
      id: uuid(),
      timeStamp: new Date(),
    };

    const messagesRef = collection(
      db,
      process.env.NODE_ENV === "development" ? "test-Messages" : "Messages"
    );
    const createdChat = await addDoc(messagesRef, {
      chatStatus: "open",
      transaction: {
        started: false,
        cardDetails: {
          ...data,
          id: data.id,
          name: data.name,
          vendor: data.name,
          subcategory: cardInfo.subcategory,
          price: cardInfo.price,
        },
      },
      messages: [
        {
          id: msg.id,
          type: "card",
          deleted: false,
          sender: {
            username: user?.displayName,
            uid: user?.uid,
          },
          recipient: "admin",
          card: {
            title: "card_detail",
            data: {
              id: data.id,
              image: data.image,
              name: data.name,
              vendor: data.name,
              subcategory: cardInfo.subcategory,
              price: cardInfo.price,
            },
          },
          timeStamp: new Date(), // date_replaced,
          edited: false,
          edited_at: null, //date
          read_receipt: {
            delivery_status: "sent", // "not_sent" | "sent" | "delivered" | "seen"
            status: false,
            time: new Date(), //date
          },
          quoted_message: {
            text: "",
            url: "",
            metadata: {
              media_name: "",
              media_size: "",
              media_type: "",
            },
          }, // or null,
        },
      ],
      lastMessage: {
        id: msg.id,
        sender: "user",
        content: {
          text: `Trade a ${cardInfo.price} ${cardInfo.cardTitle} ${cardInfo.subcategory?.value} gift card`,
          media: false,
        },
        read_receipt: {
          delivery_status: "sent",
          status: false,
          time: new Date(), // date_replaced,
        },
      },
      user: {
        username: user?.displayName,
        uid: user?.uid,
        email: user?.email,
        photoUrl: user?.photoURL || "",
      },
      created_at: new Date(), // date_replaced,
      updated_at: new Date(), // date_replaced,
    });

    const link = `${createdChat.id}`;

    await updateDoc(doc(db, "Users", user.uid), {
      cardChoices: arrayUnion({
        id: data.id,
        subcategory: cardInfo.subcategory,
        price: cardInfo.price,
      }),
      conversations: arrayUnion(link),
    });

    void sendNotificationToAdmin({
      title: "New Chat Started",
      body: `${user.displayName} started a chat for ${cardInfo.cardTitle} ${cardInfo.subcategory?.value} gift card - ${cardInfo.price}`,
      url: `https://greatexchange.co/admin/chat/${createdChat.id}`,
    });

    return {
      link,
      logged: true,
      error: "",
      proceed: true,
    };
  } catch (error) {
    console.log(error);
    return {
      link: "",
      logged: true,
      error: "Internal error",
      proceed: false,
    };
  }
};

export const startCryptoChat = async (
  cryptoData: {
    name: string;
    image: string;
    acc: string;
    id: string;
  },
  formData: FormData
) => {
  try {
    const cachedUser = cookies().get("user")?.value;
    const user = cachedUser ? (JSON.parse(cachedUser) as User) : null;

    if (!user) {
      return {
        link: "/",
        logged: false,
        error: "You must be logged in.",
        proceed: false,
      };
    }

    const msg = {
      id: uuid(),
      timeStamp: new Date(),
    };

    const price = formData.get("price");

    if (!price) {
      return {
        link: "",
        logged: true,
        error: "Please insert a price",
        proceed: false,
      };
    }

    const messagesRef = collection(
      db,
      process.env.NODE_ENV === "development" ? "test-Messages" : "Messages"
    );

    const createdChat = await addDoc(messagesRef, {
      chatStatus: "open",
      transaction: {
        started: false,
        crypto: true,
        cryptoData: {
          name: cryptoData.name,
          image: cryptoData.image,
          acc: cryptoData.acc,
          id: cryptoData.id,
          price: price,
        },
      },
      messages: [
        {
          id: msg.id,
          type: "card",
          deleted: false,
          sender: {
            username: user?.displayName,
            uid: user?.uid,
          },
          recipient: "admin",
          card: {
            title: "crypto_trade",
            data: {
              id: cryptoData.id,
              image: cryptoData.image,
              name: cryptoData.name,
              price: price,
            },
          },
          timeStamp: new Date(), // date_replaced,
          edited: false,
          edited_at: null, //date
          read_receipt: {
            delivery_status: "sent", // "not_sent" | "sent" | "delivered" | "seen"
            status: false,
            time: null, //date
          },
          quoted_message: {
            text: "",
            url: "",
            metadata: {
              media_name: "",
              media_size: "",
              media_type: "",
            },
          }, // or null,
        },
      ],
      lastMessage: {
        id: msg.id,
        sender: "user",
        content: {
          text: `A ${price} ${cryptoData.name} Trade`,
          media: false,
        },
        read_receipt: {
          delivery_status: "sent",
          status: false,
          time: new Date(), // date_replaced,
        },
      },
      user: {
        username: user?.displayName,
        uid: user?.uid,
        email: user?.email,
        photoUrl: user?.photoURL || "",
      },
      created_at: new Date(), // date_replaced,
      updated_at: new Date(), // date_replaced,
    } as unknown as Conversation);

    const link = `${createdChat.id}`;

    await updateDoc(doc(db, "Users", user.uid), {
      conversations: arrayUnion(link),
    });

    await queue.add("sendNotification", {
      userId: user.uid,
      payload: {
        title: "You have a new Chat",
        body: `${user.displayName} wants to sell ${cryptoData.name} ${cryptoData.acc} - ${price}`,
        url: `https://greatexchange.co/chat/${createdChat.id}`,
      },
    });
    // await sendNotification(
    //   user,
    //   {
    //     title: "You have a new Chat",
    //     body: `${user.displayName} wants to sell ${cryptoData.name} ${cryptoData.acc} - ${price}`,
    //     url: `https://greatexchange.co/chat/${createdChat.id}`,
    //   },
    //   user.uid
    // );

    return {
      link,
      logged: true,
      error: "",
      proceed: true,
    };
  } catch (error) {
    console.error("An error occured during the start of crypto chat:", error);
    return {
      success: false,
      msg: "An internal error occured. Please try again.",
    };
  }
};
