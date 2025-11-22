import React, { useState } from "react";
import { SunIcon } from "@heroicons/react/24/outline";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import type { Conversation } from "../../../../chat";
import Image from "next/image";
import { finishTransactionAction } from "@/lib/utils/adminActions/startTransaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { postToast } from "@/components/postToast";

type Props = {
  chatId: string;
  finishTransaction: boolean;
  card: Conversation | undefined;
  setFinishTransaction: React.Dispatch<React.SetStateAction<boolean>>;
  update?: {
    status: string;
  };
  resend?: boolean;
};

const FinishTransaction = ({
  card,
  finishTransaction,
  setFinishTransaction,
  chatId,
}: Props) => {
  const [resp, setResp] = useState("");
  const [loading, setLoading] = useState(false);
  const [transfer, setTransfer] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [cancel, setCancel] = useState(false);

  const start = async (value: string) => {
    if (value === "confirm" && referenceId === "") {
      setResp("Please enter reference ID");
      return;
    }
    try {
      setLoading(true);

      const res = await finishTransactionAction(chatId, referenceId, value);

      if (res.success) {
        setTransfer(false);
        setCancel(false);
        setFinishTransaction(false);
        setReferenceId("");
        setResp(res.message);
        postToast("Successfull", {
          description: "Transaction completed",
        });
      }

      if (!res.success) {
        setResp(res.message);
        postToast("Error!", {
          description: res.message,
        });
      }
    } catch (error) {
      postToast("Error!", {
        description: "Something went wrong",
      });
      console.log(error);
    } finally {
      setLoading(false);
      setResp("");
    }
  };

  return (
    <Drawer open={finishTransaction} onOpenChange={setFinishTransaction}>
      {transfer && (
        <DrawerContent className="max-w-md mx-auto">
          <DrawerHeader className="py-6">
            <DrawerTitle className="text-base font-bold text-center">
              Confirm & close chat
            </DrawerTitle>
            <DrawerDescription className="text-center">
              Make the tranfer and paste the{" "}
              <em className="font-bold">reference ID</em> below
            </DrawerDescription>
          </DrawerHeader>
          <div className="grid px-4 gap-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                start("confirm");
              }}
            >
              <div className="w-full px-4 grid grid-flow-row gap-4">
                <div className="flex align-middle place-items-center justify-between border rounded-lg">
                  <Input
                    className="border-none focus-visible:outline-none focus-visible:ring-0 bg-none"
                    minLength={10}
                    required
                    value={referenceId}
                    placeholder="Reference ID"
                    onChange={(e) => setReferenceId(e.target.value.trim())}
                  />
                  <Button
                    className="text-xs px-3 py-1.5 hover:bg-neutral-200 border-none"
                    onClick={() => {
                      const cliped = navigator.clipboard.readText();
                      cliped.then((e) => {
                        setReferenceId(e);
                      });
                    }}
                    type="button"
                    variant={"ghost"}
                  >
                    Paste
                  </Button>
                </div>

                {resp ? <p className="text-xs text-red-500">{resp}</p> : null}
                <div className="grid gap-3 pb-6">
                  <Button
                    type="submit"
                    title="Confirm & close chat"
                    disabled={loading}
                    className="w-full text-primary grid place-items-center hover:text-pink-400"
                    variant={"ghost"}
                  >
                    {loading && <SunIcon width={22} className="animate-spin" />}
                    Confirm & Close
                  </Button>
                  <Button
                    title="Go back"
                    disabled={loading}
                    onClick={() => {
                      setTransfer(false);
                      setCancel(false);
                    }}
                    variant={"ghost"}
                    className="w-full hover:text-neutral-500"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </DrawerContent>
      )}
      {cancel && (
        <DrawerContent className="max-w-md mx-auto">
          <DrawerHeader>
            <DrawerTitle className="text-base font-bold">
              Are you sure?
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-4 sm:grid sm:grid-cols-3 space-y-4 sm:px-0">
            <div>
              The transaction will cancelled and user will be logged out of chat
              screen
            </div>
            <Input placeholder="Reference ID" />
            <div className="grid gap-2 pb-3">
              <Button
                disabled={loading}
                onClick={() => {
                  start("cancel");
                  setTransfer(false);
                  setCancel(false);
                }}
                className="w-full"
              >
                {loading && (
                  <SunIcon
                    width={22}
                    className="animate-spin duration-1000 text-white"
                  />
                )}
                Yes, Im sure
              </Button>
              <Button
                disabled={loading}
                onClick={() => {
                  setTransfer(false);
                  setCancel(false);
                }}
                variant={"outline"}
                className="w-full hover:text-neutral-500"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DrawerContent>
      )}
      {!transfer && !cancel ? (
        <DrawerContent className="max-w-md mx-auto">
          <DrawerHeader>
            <DrawerTitle className="text-base font-bold">
              This is to keep record of the FinishTransaction
            </DrawerTitle>
          </DrawerHeader>

          <div>
            <div className="px-6">
              <div className="font-medium leading-6 text-[10px] uppercase dark:text-neutral-400 text-neutral-500">
                Amount
              </div>
              <div className="mt-1 text-xs leading-6 text-neutral-700 dark:text-neutral-400 sm:col-span-2 sm:mt-0">
                {card ? (
                  <p>
                    <span className="font-semibold text-lg">
                      ₦{card?.transaction.cardDetails.rate}
                    </span>{" "}
                    for {card?.transaction.cardDetails.price}
                  </p>
                ) : (
                  "Please wait..."
                )}
              </div>
            </div>
            <Card className="border-none shadow-none dark:bg-black">
              <CardHeader>
                <CardTitle className="text-[10px] uppercase dark:text-neutral-400 text-neutral-500">
                  Card Details
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                        {card?.transaction.cardDetails.subcategory.value ||
                          "Please wait..."}
                      </dd>
                    </div>
                    <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium leading-6 text-neutral-900 dark:text-white">
                        Price
                      </dt>
                      <dd className="mt-1 text-xs leading-6 text-neutral-700 dark:text-neutral-400 sm:col-span-2 sm:mt-0">
                        {card?.transaction.cardDetails.price ||
                          "Please wait..."}
                      </dd>
                    </div>
                  </dl>
                </div>
              </CardContent>
            </Card>
          </div>
          <DrawerFooter className="grid gap-2">
            <Button
              disabled={loading}
              onClick={() => {
                setTransfer(true);
              }}
              className="w-full"
            >
              {loading && (
                <SunIcon
                  width={22}
                  className="animate-spin duration-1000 text-white"
                />
              )}
              Make transfer
            </Button>
            <DrawerClose className="w-full mb-2 hover:text-neutral-600 ">
              Cancel
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      ) : null}
    </Drawer>
  );
};

export default FinishTransaction;
