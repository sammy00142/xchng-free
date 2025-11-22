import { adminDB } from "./firebase-admin";
import { queue } from "./notificationQueue";

export const sendNotificationToUser = async (
  userId: string,
  payload: {
    title: string;
    body: string;
    url: string;
  }
) => {
  const notificationData = {
    userId: [userId],
    payload: {
      title: payload.title,
      body: payload.body,
      icon: "/greatexc.svg",
      data: {
        url: payload.url,
        recipientId: userId,
      },
    },
  };

  await queue.add("sendNotification", notificationData);
};

export const sendNotificationToAdmin = async (payload: {
  title: string;
  body: string;
  url: string;
}) => {
  const admins = await getAdmins();

  const notificationData = {
    userId: admins,
    payload: {
      title: payload.title,
      body: payload.body,
      icon: "/greatexc.svg",
      data: {
        url: payload.url,
        recipientId: "admin",
      },
    },
  };

  await queue.add("sendNotification", notificationData);
};

const getAdmins = async () => {
  const admins = await adminDB
    .collection("Users")
    .where("role", "==", "admin")
    .get();
  const adminIds = admins.docs.map((doc) => doc.id);

  return adminIds;
};
