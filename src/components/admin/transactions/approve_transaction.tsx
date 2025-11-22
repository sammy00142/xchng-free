import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { finishTransactionAction } from "@/lib/utils/adminActions/startTransaction";
import {
  CheckIcon,
  ChevronRightIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { TransactionRec } from "../../../../chat";

type Props = {
  id: string;
  transaction?: TransactionRec;
  reval?: {
    update: boolean;
    transaction: TransactionRec;
  };
};

const ApproveTransaction = ({ id, reval }: Props) => {
  const [resp, setResp] = useState("");
  const [loading, setLoading] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [open, setOpen] = useState(false);

  const start = async (value: string) => {
    if (value === "confirm" && referenceId === "") {
      setResp("Please enter reference ID");
      return;
    }
    try {
      setLoading(true);

      const res = await finishTransactionAction(
        id,
        referenceId,
        value,
        reval?.update,
        reval?.transaction.id
      );
      console.log(res.message);

      if (res.success) {
        setResp(res.message);
        window.location.reload();
        setReferenceId("");
        setOpen(false);
      }

      if (!res.success) {
        setResp(res.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setResp("");
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger className="flex align-middle place-items-center justify-between w-full p-4 bg-white dark:bg-black border-y border-pink-100 dark:border-neutral-600 dark:border-opacity-40 hover:shadow-sm group text-emerald-700">
        <div className="flex align-middle place-items-center justify-between gap-4">
          <div className="hover:bg-text-neutral-800 px-4 py-2.5 rounded-md border border-green-400 bg-green-100 dark:bg-green-950 dark:bg-opacity-40 dark:border-green-700 dark:text-green-500">
            <CheckIcon width={14} strokeWidth={2} />
          </div>
          Approve Transaction
        </div>
        <ChevronRightIcon
          width={22}
          className="group-hover:ml-2 duration-300 ease-in"
        />
      </DrawerTrigger>
      <DrawerContent className="max-w-md">
        <DrawerHeader>
          <DrawerTitle className="text-base font-bold">
            Confirm & close chat
          </DrawerTitle>
        </DrawerHeader>
        <div className="grid px-4 gap-4">
          <div>
            Make the tranfer and paste the <em>reference ID</em> below
          </div>
          <form
            className="sm:grid sm:grid-cols-3 space-y-4 sm:px-0"
            onSubmit={(e) => {
              e.preventDefault();
              start("confirm");
            }}
          >
            <div className="flex align-middle place-items-center justify-between border rounded-lg">
              <Input
                className="border-none focus-visible:outline-none focus-visible:ring-0 bgnon"
                minLength={10}
                required
                value={referenceId}
                placeholder="Reference ID"
                onChange={(e) => setReferenceId(e.target.value)}
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
            <div className="grid gap-2 pb-3">
              <Button
                type="submit"
                title="Confirm & close chat"
                disabled={loading}
                className="w-full"
              >
                {loading && (
                  <SunIcon
                    width={22}
                    className="animate-spin duration-1000 text-white"
                  />
                )}
                Confirm & Close
              </Button>
              <DrawerClose
                title="Go back"
                disabled={loading}
                className="w-full hover:text-neutral-500"
              >
                Cancel
              </DrawerClose>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ApproveTransaction;
