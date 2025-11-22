"use client";

import React, { ReactNode, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import Cookies from "js-cookie";

type Props = {
  children: ReactNode;
};

const AdminAuthProvider = (props: Props) => {
  const router = useRouter();

  useEffect(() => {
    const uid = Cookies.get("uid");

    if (!uid) {
      redirect("/sign-in");
    }
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/sign-in");
      }
      if (user) {
        const ref = doc(db, "Users", user.uid);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          alert("You are not authorized to access this page");
          router.push("/sign-in");
          return;
        }
      }
    });
  }, [router]);
  return <div>{props.children}</div>;
};

export default AdminAuthProvider;
