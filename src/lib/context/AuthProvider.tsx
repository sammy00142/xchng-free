"use client";
import { onAuthStateChanged } from "firebase/auth";
import React, { ReactNode, createContext, useEffect, useState } from "react";
import { auth } from "../utils/firebase";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

type Props = {
  children: ReactNode;
};

export const AuthContext = createContext({});

const cachedUser = Cookies.get("user") as string;

const AuthProvider = (props: Props) => {
  const [user, setUser] = useState({});
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser || cachedUser) {
        setUser(authUser || JSON.parse(cachedUser));
        Cookies.set("user", JSON.stringify(user));
      } else {
        setUser({});
        Cookies.remove("user");
        router.push("/sell");
      }
    });

    return () => unsubscribe();
  }, [router, user]);

  return (
    <AuthContext.Provider value={user}>{props.children}</AuthContext.Provider>
  );
};

export default AuthProvider;
