"use client";

import {
  CreditCardIcon,
  PaperClipIcon,
  PhotoIcon,
} from "@heroicons/react/24/solid";
import React, { useState } from "react";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { CardDetails, Conversation } from "../../../../chat";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import SetRateComp from "./setRateDialog";
import StartAdminTransaction from "./StartTransaction";
import "react-image-crop/dist/ReactCrop.css";
import CropperJs from "@/components/chat/admin-attachment-input";

type Props = {
  message?: Conversation;
  chatId: string;
};

const AdminAttachFile = ({ message, chatId }: Props) => {
  const [openRate, setOpenRate] = useState(false);
  const [openStartTransaction, setOpenStartTransaction] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [_openEdit, setOpenEdit] = useState(false);

  return (
    <>
      <Drawer onOpenChange={setOpenDrawer} open={openDrawer}>
        <DrawerTrigger
          type="button"
          className={`focus:outline-none border-secondary rounded-xl duration-300 w-full h-full py-1 grid col-span-1 place-items-center align-middle relative`}
        >
          <PaperClipIcon width={18} />
        </DrawerTrigger>
        <DrawerContent className="z-[99999] max-w-xl mx-auto">
          <div className="max-w-md w-full mx-auto">
            <div className="grid grid-cols-3 pb-8 gap-2 md:gap-4 transition-all duration-400 p-4">
              <DrawerClose
                className="cursor-pointer transition-all duration-500 hover:dark:bg-opacity-5 hover:border-orange-300 dark:hover:border-neutral-800 border border-transparent py-6 grid place-items-center align-middle gap-2 bg-orange-100 text-orange-500 dark:bg-orange-400 dark:bg-opacity-10 rounded-3xl"
                onClick={() => {
                  setOpenEdit(true);
                }}
              >
                <PhotoIcon width={30} />
                <p className="text-xs">Gallery</p>
              </DrawerClose>

              {!message?.transaction.crypto && (
                <DrawerClose
                  className="transition-all duration-500 hover:dark:bg-opacity-5 hover:border-indigo-300 hover:dark:border-neutral-700 border border-transparent py-6 grid place-items-center align-middle gap-2 bg-indigo-100 text-indigo-500 dark:bg-indigo-400 dark:bg-opacity-10 rounded-3xl relative"
                  onClick={() => setOpenRate(true)}
                >
                  <CurrencyDollarIcon width={30} />
                  <p className="text-xs">
                    {message?.transaction.cardDetails.rate ? "Edit " : "Set "}
                    Rate
                  </p>
                  {!message?.transaction.cardDetails.rate && (
                    <span className="text-[10px] py-0.5 px-1.5 bg-rose-400 rounded-full text-white absolute -top-1 right-0">
                      Not Set
                    </span>
                  )}
                </DrawerClose>
              )}

              <DrawerClose
                className="transition-all duration-500 hover:dark:bg-opacity-5 hover:border-purple-300 hover:dark:border-neutral-700 border border-transparent py-6 grid place-items-center align-middle gap-2 bg-purple-100  text-purple-500 dark:bg-purple-400 dark:bg-opacity-10 rounded-3xl"
                onClick={() => setOpenStartTransaction(true)}
              >
                <CreditCardIcon width={30} />
                <p className="text-xs">Transaction</p>
              </DrawerClose>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {!message?.transaction.crypto && (
        <SetRateComp
          edit={message?.transaction.cardDetails.rate ? true : false}
          chatId={chatId}
          openRate={openRate}
          setOpenRate={setOpenRate}
          card={message?.transaction.cardDetails as CardDetails}
        />
      )}

      <StartAdminTransaction
        openStartTransaction={openStartTransaction}
        setOpenStartTransaction={setOpenStartTransaction}
        card={message}
        chatId={chatId}
      />
      {/* <CropImage
        chatId={chatId}
        message={message as Conversation}
        openEdit={openEdit}
        setOpenEdit={setOpenEdit}
        owns="admin"
        scrollToBottom={scrollToBottom}
      /> */}
      <CropperJs chatId={chatId} />
    </>
  );
};
export default AdminAttachFile;
