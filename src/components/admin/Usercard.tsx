"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { ChatBubbleIcon, ImageIcon } from "@radix-ui/react-icons";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import TransactionCard from "./transactions/TransactionCard";
import { TransactionRec } from "../../../chat";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/utils/firebase";
import { formatTime } from "@/lib/utils/formatTime";
import { Skeleton } from "../ui/skeleton";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { postToast } from "../postToast";
import { NewType } from "@/app/(admin)/admin/(non-auth)/users/page-cp";

type Props = {
  user: NewType;
};

const Usercard = ({ user }: Props) => {
  const [shine, setShine] = useState(false);

  useEffect(() => {
    if (window.location.hash.split("#")[1] === user.id) {
      setShine(true);
    }

    if (setShine)
      setTimeout(() => {
        setShine(false);
      }, 6000);
  }, [user.id]);

  const toggleUser = async (todo: string) => {
    const response = await fetch("/api/admin/user", {
      body: JSON.stringify({
        uid: user.id,
        todo: todo,
      }),
    });

    return (await response.json()) as { message: string; success: boolean };
  };

  return (
    <AccordionItem value={user.id} id={user.id}>
      <AccordionTrigger
        className={`${
          shine && "bg-pink-300 dark:bg-pink-900 dark:bg-opacity-20"
        } flex gap-4 py-3 px-4 hover:bg-neutral-200 dark:hover:bg-black duration-200 ease-in cursor-pointer h-fit max-w-lg w-full mx-auto hover:no-underline`}
      >
        <div className="rounded-full aspect-square grid place-items-center object-fill border-2 border-white dark:border-neutral-700 overflow-clip bg-white dark:bg-black">
          <Image
            className="self-center dark:opacity-40 aspect-square object-cover"
            src={user.imageUrl || "/logoplace.svg"}
            width={50}
            height={50}
            alt="vendor"
          />
        </div>

        <div
          className={`${
            user.disabled &&
            "text-neutral-400 dark:text-neutral-300 line-through"
          } place-self-start w-full grid grid-flow-row place-items-start`}
        >
          <h4 className="capitalize font-semibold">{user.username}</h4>
          <p className="text-neutral-500 font-normal text-xs">{user.email}</p>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="px-6 py-2 bg-white dark:bg-black">
          <div className="flex align-baseline place-items-baseline justify-start gap-3 pb-4">
            {user.disabled ? (
              <div className="px-1.5 py-[0.5px] mb-2 w-fit rounded-full bg-red-100  dark:bg-red-400/20 border dark:text-white border-red-800 font-semibold text-red-800">
                <span className="text-[0.8rem]">⚠️</span>
                <span className="text-[8px] ">User has been disabled</span>
              </div>
            ) : (
              <h4 className="font-medium uppercase text-[10px] tracking-wider text-neutral-500 ">
                User Actions
              </h4>
            )}
          </div>

          <div className="grid grid-flow-row gap-2">
            <Dialog>
              <DialogTrigger>
                <Button
                  className="w-full hover:text-neutral-600 dark:hover:text-neutral-400 dark:border dark:border-neutral-700 dark:hover:bg-transparent flex align-middle place-items-center justify-center gap-2"
                  variant={"outline"}
                  size={"sm"}
                >
                  <ChatBubbleIcon width={22} strokeWidth={2.8} />
                  View conversation
                </Button>
              </DialogTrigger>
              <DialogContent>
                <div>
                  <h4 className="text-md font-bold mb-4">User Conversations</h4>
                  {user.chats.length > 0 ? (
                    <>
                      {user.chats.map((chat, idx: number) => {
                        if (chat) {
                          return (
                            <div
                              key={idx}
                              className="flex align-middle place-items-center justify-between h-fit duration-300 max-w-lg mx-auto hover:bg-neutral-200"
                            >
                              <Link
                                href={`/admin/chat/${chat?.id}`}
                                className="grid grid-flow-col align-middle place-items-top gap-3 md:gap-10 dark:bg-opacity-10 dark:active:bg-black px-2 py-3 duration-300 dark:text-white w-full h-fit"
                                onClick={async () => {
                                  const chatRef = doc(db, "Messages", chat.id);
                                  const chatData = {
                                    "lastMessage.read_receipt": {
                                      ...chat.lastMessage.read_receipt,
                                      delivery_status: "seen",
                                      status: true,
                                    },
                                  };
                                  await updateDoc(chatRef, chatData);
                                }}
                              >
                                <div className="flex align-middle place-items-center justify-between gap-3 w-fit">
                                  {chat?.user.photoUrl ? (
                                    <Image
                                      src={
                                        chat?.user.photoUrl || "/logoplace.svg"
                                      }
                                      alt={chat?.user.username}
                                      width={40}
                                      height={40}
                                      className="aspect-square rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="p-5 h-8 w-8 bg-gradient-to-tr rounded-full from-zinc-300 self-center to-stone-400 active:to-zinc-300 active:from-stone-500 shadow-primary" />
                                  )}
                                  <div className="">
                                    <h4
                                      className={`${
                                        chat?.lastMessage?.read_receipt.status
                                          ? ""
                                          : "font-semibold text-secondary"
                                      } truncate max-w-[13rem]`}
                                    >
                                      {chat?.lastMessage?.content.media ? (
                                        <div className="flex align-middle place-items-center justify-start gap-1">
                                          <ImageIcon width={18} />
                                          <p>Media</p>
                                        </div>
                                      ) : (
                                        chat?.lastMessage.content.text
                                      )}
                                    </h4>
                                    <div className="flex align-middle place-items-center justify-between pt-1.5">
                                      <p className="text-xs text-neutral-400 font-medium capitalize">
                                        {chat?.user.username || "User"}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <p className="text-[10px] text-neutral-500 justify-self-end float-right">
                                  {formatTime(
                                    new Date(
                                      (chat?.updated_at.seconds ?? 0) * 1000 +
                                        (chat?.updated_at.nanoseconds ?? 0) /
                                          1e6
                                    ).toISOString()
                                  )}
                                </p>
                              </Link>
                            </div>
                          );
                        } else {
                          return (
                            <div key={`axile${idx}`}>
                              <Skeleton className="w-full h-8" />
                            </div>
                          );
                        }
                      })}
                    </>
                  ) : (
                    "No conversations yet"
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger>
                <Button
                  className="w-full hover:text-neutral-600 dark:hover:text-neutral-400 dark:border dark:border-neutral-700 dark:hover:bg-transparent flex align-middle place-items-center justify-center gap-2"
                  variant={"outline"}
                  size={"sm"}
                >
                  <CurrencyDollarIcon width={22} />
                  View transactions
                </Button>
              </DialogTrigger>
              <DialogContent>
                <div>
                  <h4 className="text-md font-bold mb-4">User Transactions</h4>
                  {user.transactions.length > 0 ? (
                    <>
                      {user.transactions.map(
                        (transaction: TransactionRec, idx: number) => {
                          return (
                            <TransactionCard
                              key={idx}
                              transaction={transaction}
                              idx={idx}
                            />
                          );
                        }
                      )}
                    </>
                  ) : (
                    "No transactions yet"
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-flow-col grid-cols-1 w-full mt-4 gap-4 ">
            <Drawer>
              <DrawerTrigger
                type="button"
                title="Suspend user"
                className={`py-2 font-medium duration-300 px-1 rounded-lg ${
                  user.disabled
                    ? "dark:bg-green-400/5 bg-green-400/20 text-green-800 dark:text-green-300 border-green-700 hover:bg-green-500/40 hover:border-green-500 shadow-green-800/20 hover:shadow-transparent"
                    : "dark:bg-orange-400/5 bg-orange-400/20 text-orange-800 dark:text-orange-300 border-orange-300 hover:bg-orange-500/40 hover:border-orange-500 shadow-orange-800/20 hover:shadow-transparent"
                } w-full border border-transparent shadow-md    text-xs`}
              >
                {user.disabled ? "Enable user" : "Suspend user"}
              </DrawerTrigger>
              <DrawerContent className="max-w-md mx-auto">
                <DrawerHeader>
                  <DrawerTitle>
                    {user.disabled ? "Enable user back?" : "Suspend user?"}
                  </DrawerTitle>
                  <DrawerDescription>
                    {user.disabled
                      ? "User will be able to access greatex again."
                      : "User will no longer be able to access greatex."}
                  </DrawerDescription>
                </DrawerHeader>

                <div className="px-4 grid grid-flow-row gap-3 py-6">
                  <DrawerClose
                    onSubmit={async () => {
                      postToast(
                        `${user.disabled ? "Unsuspending" : "Suspending"} ${
                          user.username
                        }`,
                        {
                          description: "Please wait...",
                          dismissible: true,
                        }
                      );
                      try {
                        const res = await toggleUser("disable");

                        if (res.success) {
                          postToast("Successfully", {
                            description: `User has been ${
                              user.disabled ? "unsuspended" : "suspended"
                            } successfully`,
                          });
                          window.location.reload();
                        } else {
                          postToast("Error", {
                            description: "An error occured, Try again later.",
                          });
                        }
                      } catch (error) {
                        console.log("TOGGLE BLOCK USER CL: ", error);
                        postToast("Error", {
                          description:
                            "An internal error occured, Try again later.",
                        });
                      }
                    }}
                    className="bg-primary p-2 rounded-md border shadow-md shadow-pink-200 dark:shadow-pink-500/10 text-white"
                  >
                    {user.disabled ? "Continue" : "Suspend user?"}
                  </DrawerClose>
                  <DrawerClose type="button" className="border rounded-md p-2 ">
                    Cancel
                  </DrawerClose>
                </div>
              </DrawerContent>
            </Drawer>

            {/* <Drawer>
                <DrawerTrigger
                  type="button"
                  title="Delete user"
                  className="py-2 font-medium duration-300 px-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 dark:bg-rose-500/5 border-rose-700 dark:hover:bg-rose-500/40 hover:border-rose-500 w-full border border-transparent shadow-md shadow-rose-100 dark:shadow-rose-800/20 hover:shadow-transparent text-rose-700 text-xs flex align-middle justify-center gap-1"
                >
                  {user.deleted ? (
                    <ResetIcon width={16} />
                  ) : (
                    <TrashIcon width={18} />
                  )}
                  {user.deleted ? "Restore user" : "Delete user"}
                </DrawerTrigger>
                <DrawerContent className="max-w-md mx-auto">
                  <DrawerHeader>
                    <DrawerTitle>
                      {user.deleted ? "Restore user" : "Delete user?"}
                    </DrawerTitle>

                    <DrawerDescription>
                      {user.deleted
                        ? "User account will be able to access Great Exchange."
                        : "User will no longer be able to use this account."}
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="grid grid-flow-row gap-4 py-4">
                    <DrawerClose
                      onClick={async () => {
                        await fetch("/api/admin/user", {
                          method: "post",
                          body: JSON.stringify({
                            uid: user.id,
                            todo: "delete",
                          }),
                        }).then((res) => {
                          res.json().then((d) => {
                            postToast(d.success ? "Done" : "Error", {
                              description: d.message,
                            });
                          });
                        });
                      }}
                    >
                      Yes, Delete
                    </DrawerClose>
                    <DrawerClose
                      type="button"
                      className="border rounded-md p-2 "
                    >
                      Cancel
                    </DrawerClose>
                  </div>
                </DrawerContent>
              </Drawer> */}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default Usercard;
