"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/utils/firebase";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { DialogClose } from "./ui/dialog";
import { postToast } from "./postToast";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import { Button } from "./ui/button";

const SignoutButton = () => {
  const router = useRouter();
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="flex align-middle place-items-center justify-start gap-2">
          <ArrowLeftOnRectangleIcon width={20} className="-scale-x-100" />
          Logout
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-md mx-auto text-center py-2">
        <DrawerHeader>
          <DrawerTitle className="text-center">Confirm log out</DrawerTitle>
          <DrawerDescription className="text-center">
            Live chat, and account features will stop working.
          </DrawerDescription>
        </DrawerHeader>
        <div className="grid grid-flow-row gap-2 pb-4 px-4">
          <DialogClose
            onClick={async () => {
              await signOut(auth);
              Cookies.remove("user");
              Cookies.remove("isLoggedIn");
              Cookies.remove("verification");
              Cookies.remove("card_page");
              postToast("Done", { description: "You have logged out" });
              router.push("/sell");
              window.location.href = "/sell";
            }}
            className="font-semibold text-red-500 border py-3 rounded-lg hover:border-neutral-300 dark:hover:border-neutral-600 border-transparent duration-300"
          >
            Logout
          </DialogClose>
          <DialogClose className="font-semibold text-neutral-500 dark:text-white border py-3 rounded-lg hover:border-neutral-300 dark:hover:border-neutral-600 border-transparent duration-300">
            Cancel
          </DialogClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SignoutButton;
