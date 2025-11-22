import { UserRecord } from "firebase-admin/auth";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export const useAdminUser = () => {
  const [user, setUser] = useState<UserRecord | null>();

  useEffect(() => {
    const user = JSON.parse(Cookies.get("user") || "{}") as UserRecord;
    setUser(user);
  }, []);
  return user;
};
