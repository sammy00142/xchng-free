import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { SunIcon } from "@heroicons/react/24/outline";
import type { Conversation } from "../../../chat";
import Image from "next/image";
import { sendConfirmTransactionToAdmin } from "@/lib/utils/actions/sendConfirmTransactionToAdmin";

type Props = {
  chatId: string;
  openConfirmTransaction: boolean;
  setOpenConfirmTransaction: React.Dispatch<React.SetStateAction<boolean>>;
  data: Conversation;
  edit?: boolean;
  idx?: number;
};

const ConfirmTransaction = ({
  openConfirmTransaction,
  setOpenConfirmTransaction,
  chatId,
  data,
  idx,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState("");

  const start = async (reason: boolean, e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    setLoading(true);

    try {
      const res = await sendConfirmTransactionToAdmin(chatId, reason, idx);

      if (res.success) {
        setOpenConfirmTransaction(false);
      } else {
        setResp(res.message);
      }
    } catch (err) {
      console.error(err);
      setResp("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const isCrypto = data.transaction.crypto;

  return (
    <Dialog
      open={openConfirmTransaction}
      onOpenChange={setOpenConfirmTransaction}
    >
      <DialogContent className="w-[95vw] max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Double-check
          </DialogTitle>
          <DialogDescription className="text-neutral-400 text-sm">
            Please confirm the details below.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="my-4">
            {isCrypto ? (
              <div>
                <Image
                  alt="Card logo"
                  width={120}
                  height={120}
                  src={data?.transaction?.cryptoData?.image || "/logoplace.svg"}
                  className="w-8 p-0.5 bg-white dark:bg-neutral-600 rounded-3xl "
                />
                <h4 className="md:text-xl text-base tracking-wide font-bold">
                  {data?.transaction?.cryptoData?.name}
                </h4>
              </div>
            ) : (
              <div className="flex pb-2 align-middle place-items-center justify-start gap-3">
                <div className="relative">
                  <Image
                    alt="Card logo"
                    width={120}
                    height={120}
                    src={
                      data?.transaction?.cardDetails?.image || "/logoplace.svg"
                    }
                    className="w-8 p-0.5 bg-white dark:bg-neutral-600 rounded-3xl "
                  />
                  <div className="absolute bottom-0 right-0">
                    <Image
                      alt="Subcategory logo"
                      width={30}
                      height={30}
                      src={
                        data?.transaction?.cardDetails?.subcategory?.image ||
                        "/logoplace.svg"
                      }
                      className="w-4 p-0.5 bg-white dark:bg-neutral-600 rounded-3xl"
                    />
                  </div>
                </div>
                <h4 className="md:text-xl text-base tracking-wide font-bold">
                  {data?.transaction?.cardDetails?.vendor} Card
                </h4>
              </div>
            )}
            <div className="border-t border-neutral-200 dark:border-neutral-700">
              <dl className="divide-y divide-neutral-300 dark:divide-neutral-600">
                {!isCrypto && (
                  <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-semibold leading-6 text-neutral-900 dark:text-white">
                      Subcategory
                    </dt>
                    <dd className="mt-1 text-xs leading-6 text-neutral-700 dark:text-neutral-400 sm:col-span-2 sm:mt-0">
                      {data?.transaction.cardDetails?.subcategory?.value ||
                        "Please wait..."}
                    </dd>
                  </div>
                )}
                {/* <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-semibold leading-6 text-neutral-900 dark:text-white">
                    You will be receiving
                  </dt>
                  <dd className="flex align-middle items-center place-items-center justify-between">
                    <div className="mt-1 text-base font-semibold leading-6 text-black dark:text-white sm:col-span-2 sm:mt-0">
                      <span>&#x20A6;</span>
                      {data.transaction.cardDetails.rate && (
                        <>
                          {formatCurrency(data.transaction.cardDetails.rate) ||
                            "Please wait..."}{" "}
                          <span className="text-xs font-normal text-neutral-700 dark:text-neutral-400">
                            for{" "}
                            {formatCurrency(
                              data.transaction.cardDetails.price
                            ) || "Please wait..."}
                          </span>
                        </>
                      )}
                    </div>
                  </dd>
                </div> */}

                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-semibold leading-6 text-neutral-900 dark:text-white">
                    Account details
                  </dt>
                  <dd className="grid align-middle">
                    <h6 className="text-sm">
                      {data?.transaction?.accountDetails?.accountNumber}{" "}
                    </h6>
                    <div className="flex gap-2 text-xs">
                      <span>
                        {data?.transaction?.accountDetails?.accountName}
                      </span>
                      <span>•</span>
                      <span>{data?.transaction?.accountDetails?.bankName}</span>
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          {resp && <p className="text-xs text-rose-500">{resp}</p>}
          <div>
            {!data?.transaction?.accountDetails?.accountNumber && (
              <p className="font-medium text-[10px] text-center text-rose-500">
                Please you must send your account details.
              </p>
            )}
            {!data?.transaction?.cardDetails?.rate ||
              (!data?.transaction?.cryptoData?.rate && (
                <p className="font-medium text-[10px] text-center text-amber-500">
                  Please request for the rate $.
                </p>
              ))}
          </div>
          <form onSubmit={(e) => start(true, e)}>
            <Button
              disabled={
                loading || !data?.transaction?.accountDetails?.accountNumber
              }
              className="flex align-middle place-items-center gap-2 mt-4 w-full"
            >
              {loading && (
                <SunIcon
                  width={22}
                  className="animate-spin duration-1000 text-white"
                />
              )}
              Confirm
            </Button>
          </form>
        </div>
        <DialogClose
          onClick={() => {
            start(false);
          }}
        >
          Reject
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmTransaction;
