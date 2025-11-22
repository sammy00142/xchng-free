import React, { useState } from "react";
import {
  CurrencyDollarIcon,
  PencilIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CardDetails, Conversation } from "../../../../chat";
import Image from "next/image";
import SetRateComp from "./setRateDialog";
import { startTransaction } from "@/lib/utils/adminActions/startTransaction";
import { formatCurrency } from "@/lib/utils/thousandSeperator";
import Loading from "@/app/loading";

type Props = {
  chatId: string;
  openStartTransaction: boolean;
  card: Conversation | undefined;
  setOpenStartTransaction: React.Dispatch<React.SetStateAction<boolean>>;
  update?: {
    status: string;
  };
  resend?: boolean;
};

const StartAdminTransaction = ({
  card,
  openStartTransaction,
  setOpenStartTransaction,
  chatId,
  resend,
  update,
}: Props) => {
  const [resp, setResp] = useState("");
  const [loading, setLoading] = useState(false);
  const [openRate, setOpenRate] = useState(false);

  const start = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await startTransaction(chatId, update, resend);

      if (res.success) {
        setOpenStartTransaction(false);
        setResp(res.message);
      } else {
        setResp(res.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setResp("");
    }
  };

  const started = () => {
    if (card) {
      if (card.transaction.started && card.transaction.status === "pending") {
        return true;
      } else {
        false;
      }
    }

    return false;
  };

  if (!card) {
    return <Loading />;
  }

  return (
    <>
      <Dialog
        open={openStartTransaction}
        onOpenChange={setOpenStartTransaction}
      >
        <DialogContent className="w-[95vw] max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Start Transaction
            </DialogTitle>
          </DialogHeader>

          {card?.transaction.crypto ? (
            <div>Crypto</div>
          ) : (
            <div>
              <div className="my-4">
                <div className="flex pb-2 align-middle place-items-center justify-start gap-3">
                  <Image
                    alt="Card logo"
                    width={100}
                    height={100}
                    src={"/logoplace.svg"}
                    className="w-8 p-1 bg-primary rounded-3xl"
                  />
                  <h4 className="md:text-xl text-base tracking-wide font-bold">
                    {card?.transaction.cardDetails.vendor} Card
                  </h4>
                </div>
                <div className="border-t border-neutral-200 dark:border-neutral-700">
                  <dl className="divide-y divide-neutral-200 dark:divide-neutral-700">
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium leading-6 text-neutral-900 dark:text-white">
                        Subcategory
                      </dt>
                      <dd className="mt-1 text-xs leading-6 text-neutral-700 dark:text-neutral-400 sm:col-span-2 sm:mt-0">
                        {card?.transaction?.cardDetails?.subcategory?.value ||
                          "Please wait..."}
                      </dd>
                    </div>
                    <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium leading-6 text-neutral-900 dark:text-white">
                        You will be sending
                      </dt>
                      <dd className="flex align-middle items-center place-items-center justify-between">
                        <div className="mt-1 text-base font-semibold leading-6 text-black dark:text-white sm:col-span-2 sm:mt-0">
                          <span>&#x20A6;</span>
                          {formatCurrency(
                            card?.transaction?.cardDetails?.rate as string
                          ) || "---.--"}{" "}
                          <span className="text-xs font-normal text-neutral-700 dark:text-neutral-400">
                            for{" "}
                            {formatCurrency(
                              card?.transaction?.cardDetails?.price as string
                            ) || "Please wait..."}
                          </span>
                        </div>
                        <div>
                          <DialogClose onClick={() => setOpenRate(true)}>
                            <Button
                              variant={"ghost"}
                              className="hover:bg-neutral-200 dark:hover:bg-black duration-300 border"
                            >
                              {card?.transaction.cardDetails.rate ? (
                                <div className="flex align-middle place-items-center justify-between gap-1">
                                  Edit <PencilIcon width={14} />
                                </div>
                              ) : (
                                <div className="flex align-middle place-items-center justify-between gap-1">
                                  Set rate <CurrencyDollarIcon width={16} />
                                </div>
                              )}
                            </Button>
                          </DialogClose>
                        </div>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              {resp && <p className="text-xs text-rose-500">{resp}</p>}
              <ol type="1">
                {!card?.transaction?.accountDetails?.accountNumber && (
                  <li className="font-medium text-[10px] text-rose-500">
                    Request for bank details to continue
                  </li>
                )}
                {!card?.transaction?.cardDetails?.rate && (
                  <li className="font-medium text-[10px] text-red-500">
                    You have not set the $ rate
                  </li>
                )}
              </ol>
              <form onSubmit={(e) => start(e)}>
                <Button
                  disabled={
                    loading ||
                    !card?.transaction?.accountDetails?.accountNumber ||
                    !card?.transaction.cardDetails.rate ||
                    started()
                  }
                  className="flex align-middle place-items-center gap-2 mt-4 w-full"
                >
                  {loading && (
                    <SunIcon
                      width={22}
                      className="animate-spin duration-1000 text-white"
                    />
                  )}
                  {started() ? "Waiting for customer" : "Send confirmation"}
                </Button>
              </form>
            </div>
          )}

          <DialogFooter>
            <DialogClose>Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {card?.transaction?.crypto ?? (
        <SetRateComp
          edit={card?.transaction?.cardDetails.rate ? true : false}
          chatId={chatId}
          openRate={openRate}
          setOpenRate={setOpenRate}
          card={card?.transaction?.cardDetails as CardDetails}
        />
      )}
    </>
  );
};

export default StartAdminTransaction;
