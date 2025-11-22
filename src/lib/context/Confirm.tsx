"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { checkIsAdmin } from "../utils/adminActions/checkAdmin";
import { useRouter } from "next/navigation";
import { postToast } from "@/components/postToast";
import { NewType } from "@/app/(admin)/admin/(non-auth)/users/page-cp";
import { SunIcon } from "@heroicons/react/24/outline";

type Props = { children: ReactNode; isAdmin: boolean };

const Confirm = ({ isAdmin, children }: Props) => {
  const [userState, setUserState] = useState(false);
  const [mounted, setMounted] = useState(false);

  const user = isAdmin;

  const router = useRouter();
  useEffect(() => {
    const check = async () => {
      if (user) {
        setUserState(true);
      } else {
        postToast("Unauthorized", {
          description: "You are not allowed access.",
          icon: <>⚠️</>,
        });
      }
    };
    setMounted(true);

    check();
  }, [router, user]);

  if (!mounted) {
    return (
      <div className="flex gap-1 h-24 text-center text-xs place-items-center justify-center align-middle">
        <SunIcon width={18} className="animate-spin text-pink-500" />
        Please wait...
      </div>
    );
  }

  if (userState) {
    return <div>{children}</div>;
  }
};

export default Confirm;
