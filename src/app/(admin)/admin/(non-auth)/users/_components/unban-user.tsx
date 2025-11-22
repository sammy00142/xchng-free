import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { unbanUserAction } from "@/lib/utils/adminActions/getAllUsers";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  username: string;
  isAdmin: boolean;
  email: string;
  image: string | undefined;
  role: string;
  messages: string[];
  transactions: string[];
  disabled: boolean;
  customClaims:
    | {
        [key: string]: any;
      }
    | undefined;
};

const UnbanUser = ({ user, working }: { user: User; working: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  return (
    <div>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            disabled={working}
            className="w-full flex gap-2 justify-center duration-300 transition-all ease-in dark:hover:bg-neutral-900 text-red-500"
          >
            Unban User
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Are you sure?</DrawerTitle>
          </DrawerHeader>

          <div className="flex flex-col gap-2 p-2 text-center">
            <h4>
              You are about to unban{" "}
              <span className="font-semibold text-primary capitalize">
                {user.username}
              </span>
            </h4>
          </div>

          <DrawerFooter className="mb-8">
            <Button
              onClick={async () => {
                setLoading(true);

                try {
                  await unbanUserAction(user.id);
                  toast({
                    title: "User has been unbanned",
                    variant: "destructive",
                  });
                  setIsOpen(false);
                  router.refresh(); // Refresh the page
                } catch (error) {
                  console.error("Error unbanning user", error);
                  toast({
                    title: "Error unbanning user",
                    variant: "destructive",
                  });
                } finally {
                  setLoading(false);
                }
              }}
              variant={"outline"}
              className="w-full"
              disabled={working || loading}
            >
              {loading && <Loader2 size={16} className="mr-2 animate-spin" />}
              Unban
            </Button>
            <DrawerClose asChild>
              <Button disabled={working || loading}>Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default UnbanUser;
