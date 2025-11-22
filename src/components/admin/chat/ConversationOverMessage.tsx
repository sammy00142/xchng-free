import React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Link from "next/link";
import { reopenChat } from "@/lib/utils/actions/reopenChat";

type Props = {
  admin?: boolean;
  chatId?: string;
};

const ConversationOverMessage = ({ admin, chatId }: Props) => {
  return (
    <div className="text-xs p-2 left-1/2 -translate-x-1/2 fixed bottom-0 w-screen py-1.5 bg-primary text-center text-white">
      <em>This coversation is over</em>
      {admin && chatId ? (
        <Drawer>
          <DrawerTrigger>
            <Button className="text-white" variant={"link"}>
              Re-open
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Are you sure?</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pt-4">
              This will re-open the conversation and allow the user to continue
              sending messages
            </div>
            <DrawerFooter className="flex justify-between align-middle place-items-center gap-3">
              <DrawerClose onClick={() => reopenChat(chatId)}>
                <Button>Yes, i&apos;m sure</Button>
              </DrawerClose>
              <DrawerClose className="hover:bg-neutral-200 px-4 py-2 rounded-xl">
                Cancel
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Link href={"/support"}>
          <Button variant={"link"} className="text-white">
            Report an issue
          </Button>
        </Link>
      )}
    </div>
  );
};

export default ConversationOverMessage;
