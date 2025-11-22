"use server";

import { getUserCookie } from "../getUserCookie";

const baseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_BASE_URL
    : "https://greatexchange.co";

export const checkIsAdmin = async () => {
  const u = await getUserCookie();

  if (!u) {
    return {
      isAdmin: false,
      message: "User does not exists in cookies",
      user: null,
    };
  }

  try {
    const user = JSON.parse(u);

    const checkUser = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/validate?uid=${user.uid}`,
      {
        method: "GET",
      }
    );

    const response = await checkUser.json();

    if (response.isAdmin) {
      return {
        isAdmin: true,
        message: "User is admin",
        user: response.user,
      };
    }
  } catch (error) {
    console.log("CHECK ADMIN: ", error);
    return {
      isAdmin: false,
      message: "Internal error occured!",
      user: null,
    };
  }
};
