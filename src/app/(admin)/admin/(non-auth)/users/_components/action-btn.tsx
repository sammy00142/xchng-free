"use client";
import { postToast } from "@/components/postToast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  banUserAction,
  deleteUserAction,
} from "@/lib/utils/adminActions/getAllUsers";
import {
  DollarSign,
  EllipsisVertical,
  InfoIcon,
  Loader2,
  MessageCircle,
  Trash2Icon,
} from "lucide-react";
import MakeAdmin from "./make-admin";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import UnbanUser from "./unban-user";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

const UserActionButton = ({ user }: { user: User }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [banLoading, setBanLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const router = useRouter();

  const handleDeleteUser = () => {
    setLoading(true);
    setDeleteLoading(true);
    const { dismiss, update } = toast({
      description: (
        <div className="flex flex-col gap-2">
          <Loader2 className="animate-spin" size={16} /> Deleting user
        </div>
      ),
      duration: 1000000,
    });

    deleteUserAction(user.id)
      .then(() => {
        postToast("User deleted successfully");
        setLoading(false);
        setDeleteLoading(false);
        update({
          description: <div className="flex flex-col gap-2">Deleted</div>,
          id: "delete-user",
        });

        dismiss();
      })
      .catch((err) => {
        console.error(err);
        postToast("Error deleting user");
        setLoading(false);
        setDeleteLoading(false);
        update({
          variant: "destructive",
          description: (
            <div className="flex flex-col gap-2">Error deleting user</div>
          ),
          id: "delete-user",
        });
        dismiss();
      });
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant={"outline"} size={"icon"}>
          <EllipsisVertical />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-screen-sm mx-auto">
        <DrawerHeader className="flex gap-2 justify-between place-items-center align-middle">
          <div className="flex gap-2 place-items-center align-middle">
            <Avatar>
              <AvatarImage
                src={
                  user.image ??
                  "https://dashboard.clerk.com/_next/image?url=https%3A%2F%2Fimg.clerk.com%2Fpreview.png%3Fsize%3D144%26seed%3Dseed%26initials%3DAD%26isSquare%3Dtrue%26bgType%3Dmarble%26bgColor%3D9e9e9e%26fgType%3Dsilhouette%26fgColor%3DFFFFFF%26type%3Duser&w=48&q=75"
                }
                className={`${!user.image && "dark:opacity-60"}`}
                alt={user.username}
              />
              <AvatarFallback>
                {user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <DrawerTitle className="flex justify-start">
                <h4 className="text-lg font-bold capitalize">
                  {user.username}
                </h4>
              </DrawerTitle>
              <DrawerDescription asChild className="flex justify-start">
                <p className="text-xs truncate w-44 text-neutral-500">
                  {user.email}
                </p>
              </DrawerDescription>
            </div>
          </div>

          <div className="flex align-middle place-items-center gap-4">
            <div
              title={"Messages"}
              className="flex align-middle place-items-center gap-1"
            >
              <MessageCircle
                className="text-blue-500"
                strokeWidth={2}
                size={18}
              />
              <h4>{user.messages.length}</h4>
            </div>
            <div
              title={"Transactions"}
              className="flex align-middle place-items-center gap-1"
            >
              <DollarSign
                className="text-green-500"
                strokeWidth={2}
                size={18}
              />
              <h4>{user.transactions.length}</h4>
            </div>
          </div>
        </DrawerHeader>

        {user.disabled ? (
          <div className="flex flex-col gap-2 pt-4 pb-8 px-4 border-t">
            <h4>User is banned</h4>
          </div>
        ) : (
          <div className="flex flex-col gap-2 pt-4 pb-8 px-4 border-t">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  disabled={loading || deleteLoading}
                  className="w-full flex gap-2 justify-start duration-300 transition-all ease-in dark:hover:bg-neutral-900 text-orange-400"
                >
                  {deleteLoading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Trash2Icon size={20} />
                  )}
                  <h4>Delete user</h4>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the user account and remove their data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteUser}>
                    Delete User
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              variant="ghost"
              disabled={loading}
              className="w-full flex gap-2 justify-start duration-300 transition-all ease-in dark:hover:bg-neutral-900 text-orange-400"
              onClick={async () => {
                setLoading(true);
                setBanLoading(true);
                const { dismiss, update } = toast({
                  description: (
                    <div className="flex flex-col gap-2">
                      <Loader2 className="animate-spin" size={16} /> Banning
                      user
                    </div>
                  ),
                  duration: 1000000,
                });
                try {
                  await banUserAction(user.id);
                  postToast("User banned successfully");
                  setLoading(false);
                  setBanLoading(false);
                  update({
                    description: (
                      <div className="flex flex-col gap-2">Banned</div>
                    ),
                    id: "ban-user",
                  });

                  dismiss();

                  router.refresh();
                } catch (err) {
                  postToast("Error banning user");
                  setLoading(false);
                  setBanLoading(false);
                  update({
                    variant: "destructive",
                    description: (
                      <div className="flex flex-col gap-2">
                        Error banning user
                      </div>
                    ),
                    id: "ban-user",
                  });
                  dismiss();
                }
              }}
            >
              {banLoading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <InfoIcon size={20} />
              )}
              <h4>Ban user</h4>
            </Button>
          </div>
        )}

        <DrawerFooter className="pb-8 pt-0">
          {user.disabled ? (
            <UnbanUser
              user={user}
              working={loading || banLoading || deleteLoading}
            />
          ) : (
            <MakeAdmin
              user={user}
              working={loading || banLoading || deleteLoading}
            />
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default UserActionButton;
