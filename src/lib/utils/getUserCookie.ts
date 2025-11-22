import { cookies } from "next/headers";

export const getUserCookie = async () => {
  const user = cookies().get("user")?.value;
  if (user) {
    return user;
  } else {
    return null;
  }
};

export const getTypedUserCookie = async () => {
  const u = cookies().get("user")?.value;
  const user = u ? JSON.parse(u) : null;

  if (user) {
    return user;
  } else {
    return null;
  }
};
