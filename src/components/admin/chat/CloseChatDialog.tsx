"use client";

import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { closeChat } from "@/lib/utils/adminActions/startTransaction";
import { usePathname } from "next/navigation";

type Props = {
  confirmClose: boolean;
  setConfirmClose: React.Dispatch<React.SetStateAction<boolean>>;
};

const CloseChatDialog = ({ confirmClose, setConfirmClose }: Props) => {
  const pathname = usePathname();

  const id = pathname.split("/")[3];
  return (
    <>
      <Dialog open={confirmClose} onOpenChange={setConfirmClose}>
        <DialogContent className="border ">
          <DialogHeader>
            <DialogTitle>Are you sure</DialogTitle>
          </DialogHeader>
          <div>
            This will close the chat and user will not be able to send any more
            messages.
          </div>
          <DialogFooter>
            <DialogClose
              onClick={() => {
                closeChat(id as string);
              }}
            >
              <Button>Yes, I&apos;m sure</Button>
            </DialogClose>
            <DialogClose>
              <Button variant={"ghost"}>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CloseChatDialog;
