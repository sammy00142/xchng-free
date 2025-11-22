import CardComponent from "@/components/chat/bubbles/card_comp";
import { Button } from "@/components/ui/button";
import {
  CheckIcon,
  EyeIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { CopyIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import React, { useState } from "react";
import {  Message } from "../../../../chat";
import { formatCurrency } from "@/lib/utils/thousandSeperator";
import { adminCurrConversationStore } from "@/lib/utils/store/adminConversation";
import Cookies from "js-cookie";

type Props = {
  setUpdate: React.Dispatch<
    React.SetStateAction<{
      status: string;
    }>
  >;
  setResend: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenStartTransaction: React.Dispatch<React.SetStateAction<boolean>>;
  setFinishTransaction: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenRate: React.Dispatch<React.SetStateAction<boolean>>;
  setCopied: React.Dispatch<React.SetStateAction<boolean>>;
  message: Message;
  copied: boolean;
  idx: number;
};

const cachedUser = Cookies.get("user");
const user = JSON.parse(cachedUser || "{}");

const AdminCardMessages = ({
  setResend,
  setUpdate,
  setOpenRate,
  setCopied,
  copied,
  idx,
  setFinishTransaction,
  setOpenStartTransaction,
  message,
}: Props) => {
  const [hideCode, setHideCode] = useState(true);
  const { conversation } = adminCurrConversationStore();
  const card = conversation?.transaction.cardDetails;

  return (
    <div
      key={idx}
      className={`my-3 relative md:max-w-[350px] max-w-[260px] min-w-[200px] transition-all duration-500 flex align-middle place-items-end rounded-b-2xl justify-between gap-2 bg-neutral-200/50 dark:bg-neutral-900 shadow-s ${
        message.sender.uid === user.uid
          ? "justify-self-end rounded-tl-2xl rounded-tr-[3px] mr-2"
          : "justify-self-start rounded-tr-2xl rounded-tl-[3px] ml-2"
      } `}
    >
      {message.card?.title === "Account Details" && (
        <CardComponent
          footer={
            <>
              <Button
                onClick={() => {
                  navigator.clipboard
                    .writeText(message.card?.data?.accountNumber)
                    .then(() => {
                      setCopied(true);
                    });
                }}
                title="Copy Account Number"
                variant={"ghost"}
                className="float-right text-xs"
              >
                {copied ? (
                  <div className="flex gap-1 align-middle place-items-center items-center">
                    Copied <ShieldCheckIcon width={18} />
                  </div>
                ) : (
                  <CopyIcon width={18} />
                )}
              </Button>
            </>
          }
          title={"Account Details"}
          key={idx}
        >
          <div>
            <dl className="divide-y divide-pink-700/10 dark:divide-neutral-800">
              <div className="py-2 sm:grid sm:grid-cols-3 pr-8 sm:gap-4 sm:px-0">
                <dt className=" text-neutral-700 text-sm leading-6 dark:text-neutral-300">
                  Account Number
                </dt>
                <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0 font-medium">
                  {message.card.data?.accountNumber}
                </dd>
              </div>
              <div className="py-2 sm:grid sm:grid-cols-3 pr-8 sm:gap-4 sm:px-0">
                <dt className=" text-neutral-700 text-sm leading-6 dark:text-neutral-300">
                  Account Name
                </dt>
                <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0 font-medium">
                  {message.card.data?.accountName}
                </dd>
              </div>
              <div className="py-2 sm:grid sm:grid-cols-3 pr-8 sm:gap-4 sm:px-0">
                <dt className=" text-neutral-700 text-sm leading-6 dark:text-neutral-300">
                  Account Bank
                </dt>
                <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0 font-medium">
                  {message.card.data?.bankName}
                </dd>
              </div>
            </dl>
          </div>
        </CardComponent>
      )}
      {message.card.title === "card_detail" && (
        <CardComponent title={"Card Details"} key={idx}>
          <div className="flex pb-2 align-middle place-items-center justify-start gap-3 ">
            <div className="relative">
              <Image
                alt="Card logo"
                width={120}
                height={120}
                src={message?.card?.data?.image || "/logoplace.svg"}
                className="w-8 p-0.5 bg-white dark:bg-neutral-600 rounded-3xl border-2"
              />
              <div className="absolute bottom-0 right-0">
                <Image
                  alt="Subcategory logo"
                  width={30}
                  height={30}
                  src={
                    message?.card?.data?.subcategory?.image || "/logoplace.svg"
                  }
                  className="w-4 p-0.5 bg-white dark:bg-neutral-600 rounded-3xl"
                />
              </div>
            </div>
            <h4 className=" font-medium">{message?.card?.data?.vendor} Card</h4>
          </div>
          <div className="border-t border-pink-700/10 dark:border-neutral-700">
            <dl className="divide-y divide-pink-700/10 dark:divide-neutral-700">
              <div className="py-2 sm:grid sm:grid-cols-3 pr-8 sm:gap-4 sm:px-0">
                <dt className=" text-neutral-700 text-sm leading-6 dark:text-neutral-300">
                  Subcategory
                </dt>
                <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0 font-medium">
                  {message?.card?.data?.subcategory.value.replace(
                    `${message?.card?.data?.vendor}`,
                    ""
                  ) || "Please wait..."}
                </dd>
              </div>
              <div className="py-2 sm:grid sm:grid-cols-3 pr-8 sm:gap-4 sm:px-0">
                <dt className=" text-neutral-700 text-sm leading-6 dark:text-neutral-300">
                  Price
                </dt>
                <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0 font-medium">
                  {message?.card?.data?.price || "Please wait..."}
                </dd>
              </div>
            </dl>
          </div>
        </CardComponent>
      )}

      {message.card.title === "crypto_trade" && (
        <CardComponent title={"Crypto Details"} key={idx}>
          <>
            <div className="flex pb-2 align-middle place-items-center justify-start gap-3 ">
              <div className="relative">
                <Image
                  alt="Card logo"
                  width={120}
                  height={120}
                  src={message?.card?.data?.image || "/logoplace.svg"}
                  className="w-8 p-0.5 bg-white dark:bg-neutral-600 rounded-3xl border-2"
                />
                <div className="absolute bottom-0 right-0">
                  <Image
                    alt="Subcategory logo"
                    width={30}
                    height={30}
                    src={message?.card?.data?.image || "/logoplace.svg"}
                    className="w-4 p-0.5 bg-white dark:bg-neutral-600 rounded-3xl"
                  />
                </div>
              </div>
              <h4 className=" font-medium">{message?.card?.data.name}</h4>
            </div>
            <div className="border-t border-pink-700/10 dark:border-neutral-700">
              <dl className="divide-y divide-pink-700/10 dark:divide-neutral-700">
                <div className="py-2 sm:grid sm:grid-cols-3 pr-8 sm:gap-4 sm:px-0">
                  <dt className=" text-neutral-700 text-sm leading-6 dark:text-neutral-300">
                    Price
                  </dt>
                  <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0 font-medium">
                    {message?.card?.data?.price || "Please wait..."}
                  </dd>
                </div>
              </dl>
            </div>
          </>
        </CardComponent>
      )}

      {message.card?.title === "e-Code" && (
        <CardComponent title={"E-code"} key={idx}>
          <div className="flex align-middle justify-center place-items-center">
            <div
              className={`${
                !hideCode ? "text-[1.1em]" : " dark:text-neutral-600"
              } select-none py-1.5 px-2.5 rounded-lgst duration-50 bg-neutral-100 dark:bg-black`}
            >
              {!hideCode
                ? message.card.data?.value.replace(/(.{4})/g, "$1 ")
                : "●●●● ●●●● ●●●● ●●●●"}
            </div>
            <button
              onClick={() => setHideCode((prev) => !prev)}
              className="p-1.5 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 duration-300"
            >
              {hideCode ? <EyeClosedIcon width={18} /> : <EyeIcon width={18} />}
            </button>
          </div>
        </CardComponent>
      )}
      {message.card?.title === "rate" && (
        <CardComponent
          footer={
            <>
              <Button onClick={() => setOpenRate(true)}>Edit</Button>
            </>
          }
          title="Card Rate"
        >
          <div className="select-none text-lg font-medium">
            ₦{formatCurrency(message.card.data?.value)}
          </div>
          <div className="select-none text-neutral-600 dark:text-neutral-300 text-base">
            for {card?.price ? formatCurrency(card?.price.toString()) : "--"}
          </div>
        </CardComponent>
      )}
      {message.card.title === "start_transaction" && (
        <CardComponent
          footer={
            !conversation?.transaction.completed ? (
              <div className="mt-2">
                {!conversation?.transaction.accepted &&
                message.card?.data.status === "rejected_by_user" ? (
                  <Button
                    className="hover:text-black dark:hover:text-primary border border-white bg-white/40"
                    variant={"outline"}
                    onClick={() => {
                      setResend(true);
                      setOpenStartTransaction(true);
                    }}
                  >
                    Resend
                  </Button>
                ) : message.card?.data.status === "accepted_by_user" ? (
                  <Button
                    className="hover:text-black dark:hover:text-primary border border-white bg-white/40"
                    variant={"outline"}
                    onClick={() => {
                      setUpdate({
                        status: "done",
                      });
                      setFinishTransaction(true);
                    }}
                  >
                    Finish transaction
                  </Button>
                ) : null}
              </div>
            ) : (
              <div className="italic text-xs text-opacity-60 text-black mt-2 flex align-middle place-items-center justify-start gap-1">
                <CheckIcon strokeWidth={2} width={14} /> Transaction completed
              </div>
            )
          }
          title={
            message.card.data.status === "rejected_by_user"
              ? "Rejected"
              : message.card.data.status === "accepted_by_user"
              ? "Accepted"
              : "Confirm"
          }
          desc={
            message.card.data.status === "rejected_by_user" ? (
              <p>❌ You rejected this transaction</p>
            ) : message.card.data.status === "accepted_by_user" ? (
              <p>✔️ Transaction is Confirmed.</p>
            ) : (
              <p>Please confirm details to complete the transaction</p>
            )
          }
          color={
            message.card.data.status === "rejected_by_user"
              ? "red"
              : message.card.data.status === "accepted_by_user"
              ? "green"
              : undefined
          }
        />
      )}
    </div>
  );
};

export default AdminCardMessages;
