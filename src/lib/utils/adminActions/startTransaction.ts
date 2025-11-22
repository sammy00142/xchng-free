"use server";

import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  Conversation,
  MediaContent,
  ReadReceipt,
  Sender,
  TransactionRec,
} from "../../../../chat";
import { v4 } from "uuid";
import { checkServerAdmin } from "./checkServerAdmin";
import { timeStamper } from "../timeStamper";
import { checkIsAdmin } from "./checkAdmin";
import { sendNotificationToUser } from "../sendNotification";

export const startTransaction = async (
  id: string,
  update?: {
    status: string;
  },
  resend?: boolean,
  idx?: number
) => {
  try {
    const user = await checkIsAdmin();

    if (!user?.isAdmin)
      return {
        message: "Not Allowed. User is not an admin",
        success: false,
      };

    const chatDocRef = doc(
      db,
      process.env.NODE_ENV === "development" ? "test-Messages" : "Messages",
      id as string
    );

    const docSnapshot = await getDoc(chatDocRef);
    const data = docSnapshot.data() as Conversation;

    const userData = JSON.parse(user.user);

    if (!update || !data.transaction.started) {
      await updateDoc(chatDocRef, {
        "lastMessage.read_receipt": {
          delivery_status: "seen",
          status: true,
        },
        updated_at: timeStamper(),
        "transaction.started": true,
        "transaction.accepted": false,
        "transaction.status": "pending",
      });

      const msg = {
        id: v4(),
        timeStamp: new Date(),
      };

      await updateDoc(chatDocRef, {
        lastMessage: {
          id: msg.id,
          content: {
            text: "Transaction Request",
            media: false,
          },
          read_receipt: {
            delivery_status: "sent",
            status: false,
            time: new Date(), // date_replaced,
          },
        },
        messages: arrayUnion({
          id: msg.id,
          type: "card",
          deleted: false,
          sender: {
            username: userData.displayName,
            uid: userData.uid,
          },
          recipient: "user",
          card: {
            title: "start_transaction",
            data: {
              rate: data?.transaction.cardDetails.rate,
              price: data?.transaction.cardDetails.price,
              status: "waiting_for_user",
            },
          },
          timeStamp: new Date(), // date_replaced,
          resended: false,
          read_receipt: {
            delivery_status: "sent",
            status: false,
            time: new Date(), // date_replaced,
          },
        }),
        updated_at: new Date(), // date_replaced,
      });
    } else {
      if (data) {
        const index =
          idx ||
          data.messages.findLastIndex(
            (msg) => msg.card.title === "start_transaction"
          );

        const time = timeStamper();

        if (Array.isArray(data.messages)) {
          data.messages[index] = {
            ...data.messages[index],
            id: data.messages[index]?.id as string,
            type: data.messages[index]?.id as string,
            deleted: data.messages[index]?.deleted as boolean,
            content: data.messages[index]?.content as {
              text: string;
              media: MediaContent;
              url: string;
              caption: string;
            },
            recipient: data.messages[index]?.recipient as string,
            sender: data.messages[index]?.sender as Sender,
            read_receipt: data.messages[index]?.read_receipt as ReadReceipt,
            // status: data.messages[index]?.status as boolean,
            card: {
              title: "start_transaction",
              data: {
                rate: data.transaction.cardDetails.rate,
                price: data.transaction.cardDetails.price,
              },
            },
            edited: true,
            edited_at: time,
            timeStamp: time,
          };

          await updateDoc(chatDocRef, {
            messages: data.messages,
            updated_at: time,
            "transaction.started": true,
            "transaction.accepted": false,
            "transaction.status": update?.status,
          });
        }
      } else {
        return {
          message: "Transaction not found",
          success: false,
        };
      }
    }

    await sendNotificationToUser(data.user.uid, {
      title: `Transaction started`,
      body: `Lets confirm the transaction of ${data.transaction.cardDetails.name} Card -  ${data.transaction.cardDetails.price} USD`,
      url: `https://greatexchange.co/chat/${id}`,
    });

    return {
      message: "Transaction started successfully",
      success: true,
    };
  } catch (error) {
    console.log("START_TRANSACTION: ", error);
    return {
      message: "Internal error. Error starting transaction",
      success: false,
    };
  }
};

export const finishTransactionAction = async (
  id: string,
  referenceId: string,
  resp: string,
  update?: boolean,
  tId?: string
) => {
  try {
    const user = await checkIsAdmin();

    if (!user?.isAdmin)
      return {
        message: "Not Allowed. User is not an admin",
        success: false,
      };

    if (!resp || !referenceId)
      return {
        success: false,
        message: "Insufficient parameters",
      };

    const chatDocRef = doc(
      db,
      process.env.NODE_ENV === "development" ? "test-Messages" : "Messages",
      id as string
    );
    const transactionDocRef = collection(db, "Transactions");

    const time = timeStamper();

    if (resp === "confirm") {
      const docSnapshot = await getDoc(chatDocRef);
      const chatData = {
        ...docSnapshot.data(),
        id: id,
      } as Conversation;

      await updateDoc(chatDocRef, {
        "lastMessage.read_receipt": {
          delivery_status: "seen",
          status: true,
        },
        updated_at: time,
        "transaction.status": "done",
      }).catch((e) => {
        console.log("UPDATE_CHAT_ERROR", e);
      });

      if (update) {
        const transactionRef = doc(db, "Transactions", tId as string);

        await updateDoc(transactionRef, {
          "data.status": "done",
          "payment.reference": referenceId,
        });
      } else {
        await addDoc(transactionDocRef, {
          data: { ...chatData.transaction, status: "done", completed: true },
          userId: chatData.user.uid,
          payment: {
            reference: referenceId,
            method: "transfer",
          },
          chatId: chatData.id,
          created_at: time,
          updated_at: time,
        }).then(async ({ id }) => {
          await updateDoc(doc(db, "Users", chatData.user.uid), {
            transacions: arrayUnion(id),
          });
        });
      }

      return {
        success: true,
        message: "Transaction completed",
      };
    } else {
      const docSnapshot = await getDoc(chatDocRef);
      const data = docSnapshot.data() as Conversation;

      await updateDoc(chatDocRef, {
        "lastMessage.read_receipt": {
          delivery_status: "seen",
          status: true,
        },
        updated_at: time,
        "transaction.status": "cancelled",
        "transaction.completed": false,
      });

      await addDoc(transactionDocRef, {
        data: {
          ...data.transaction,
          status: "cancelled",
        },
        userId: data.user.uid,
        payment: {
          reference: referenceId,
          method: "transfer",
        },
        chatId: data.id,
        created_at: time,
        updated_at: time,
      } as TransactionRec);

      await sendNotificationToUser(data.user.uid, {
        title: `Transaction Completed`,
        body: `Transaction for ${data.transaction.cardDetails.name} Card -  ${data.transaction.cardDetails.price} USD}`,
        url: `https://greatexchange.co/chat/${id}`,
      });

      return {
        success: true,
        message: "Transaction cancelled",
      };
    }
  } catch (error) {
    return {
      message: "Internal server error.",
      success: false,
    };
  }
};

export const closeChat = async (id: string) => {
  try {
    const user = await checkIsAdmin();

    if (!user?.isAdmin)
      return {
        message: "Not Allowed. User is not an admin",
        success: false,
      };

    const chatDocRef = doc(
      db,
      process.env.NODE_ENV === "development" ? "test-Messages" : "Messages",
      id as string
    );
    const time = timeStamper();

    await updateDoc(chatDocRef, {
      "lastMessage.read_receipt": {
        delivery_status: "seen",
        status: true,
      },
      updated_at: time,
      chatStatus: "closed",
    });

    return {
      message: "Chat closed.",
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Internal error",
      success: false,
    };
  }
};

export const cancelTransaction = async (chatId: string, tId: string) => {
  try {
    const user = await checkIsAdmin();

    if (!user?.isAdmin)
      return {
        message: "Not Allowed. User is not an admin",
        success: false,
      };

    const transactionRef = doc(db, "Transactions", tId as string);

    const { success } = await closeChat(chatId);

    if (!success) {
      return {
        message: "Error closing chat",
        success: false,
      };
    }

    await updateDoc(transactionRef, {
      isApproved: false,
      "data.status": "cancelled",
    });

    return {
      message: "Transaction Cancelled",
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Internal error",
      success: false,
    };
  }
};
