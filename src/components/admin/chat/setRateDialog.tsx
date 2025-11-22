import React, { useState } from "react";
import { SunIcon } from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { setCardRate } from "@/lib/utils/adminActions/setRate";
import { CardDetails } from "../../../../chat";

type Props = {
  chatId: string;
  openRate: boolean;
  card: CardDetails;
  setOpenRate: React.Dispatch<React.SetStateAction<boolean>>;
  edit?: boolean;
  idx?: number;
};

const SetRateComp = ({
  card,
  openRate,
  setOpenRate,
  chatId,
  edit,
  idx,
}: Props) => {
  const [_rate, setRate] = useState("");
  const [resp, setResp] = useState("");
  const [loading, setLoading] = useState(false);

  const sendRate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await setCardRate(
        chatId,
        new FormData(e.target as HTMLFormElement),
        edit,
        idx
      );

      if (res.success) {
        setOpenRate(false);
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

  return (
    <Dialog open={openRate} onOpenChange={setOpenRate}>
      <DialogContent className="w-[95vw] max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium">Set rate</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Enter price in Naira:{" "}
            <span className="font-bold text-black">{card?.price}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <form className="grid gap-4" onSubmit={sendRate}>
            <div className="flex align-middle place-items-center justify-between gap-2">
              <span className="font-bold text-lg">₦</span>
              <Input
                id="rate"
                disabled={loading}
                type="text"
                required
                name="rate"
                onChange={(e) => setRate(e.target.value)}
                placeholder="0"
                autoComplete="off"
                className="border-neutral-300 dark:border-neutral-800 text-lg placeholder:text-neutral-300"
              />
            </div>

            {resp && <p className="text-xs text-rose-500">{resp}</p>}
            <Button
              disabled={loading}
              className="flex align-middle place-items-center gap-2"
            >
              {loading && (
                <SunIcon
                  width={22}
                  className="animate-spin duration-1000 text-white"
                />
              )}
              Set
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SetRateComp;
