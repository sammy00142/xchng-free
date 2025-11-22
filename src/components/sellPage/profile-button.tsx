import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ToggleTheme from "../toggleTheme";
import {
  ArrowDownTrayIcon,
  ChatBubbleBottomCenterTextIcon,
  ReceiptPercentIcon,
  UserIcon as UserIconOutline,
} from "@heroicons/react/24/outline";
import {
  BellIcon,
  EllipsisVerticalIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  useAuth,
  useUser,
} from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const ProfileButton = () => {
  const { userId } = useAuth();
  const { user } = useUser();

  const isSignedIn = userId !== null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          {isSignedIn && user ? (
            <Button
              className="bg-neutral-200 rounded-full"
              variant={"ghost"}
              size={"icon"}
            >
              <Image
                src={user.imageUrl}
                width={58}
                height={58}
                alt={user!.username || "image"}
                priority
                className="w-full rounded-full aspect-square object-cover text-[10px]"
              />
            </Button>
          ) : (
            <Button
              variant={"ghost"}
              className="rounded-full border bg-neutral-200 dark:bg-neutral-800"
              size={"icon"}
            >
              <EllipsisVerticalIcon width={24} />
            </Button>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 ml-2 z-50 grid">
        {user && (
          <DropdownMenuLabel className="capitalize border-b pb-2 tracking-wider flex place-items-center gap-2 w-full py-1.5 px-2">
            {user.username}
          </DropdownMenuLabel>
        )}
        <DropdownMenuSeparator />
        <div id="installContainer">
          <DropdownMenuItem
            id="installButton"
            className="py-3 w-full juxstify-start gap-2 hidden"
          >
            <ArrowDownTrayIcon width={16} />
            Install App
          </DropdownMenuItem>
        </div>

        <ToggleTheme />

        {user && (
          <DropdownMenuGroup className="">
            <Link className="py-3" href={"/chat"}>
              <DropdownMenuItem className="py-3 w-full juxstify-start gap-4">
                <ChatBubbleBottomCenterTextIcon width={16} />
                Chats
              </DropdownMenuItem>
            </Link>
            <Link className="py-3" href={"/trade"}>
              <DropdownMenuItem className="py-3 w-full juxstify-start gap-4">
                <ReceiptPercentIcon width={16} />
                Transactions
              </DropdownMenuItem>
            </Link>
            <Link className="py-3" href={"/profile"}>
              <DropdownMenuItem className="py-3 w-full juxstify-start gap-4">
                <UserIconOutline width={16} />
                Profile
              </DropdownMenuItem>
            </Link>
            <Link className="py-3" href={"/notification"}>
              <DropdownMenuItem className="py-3 w-full juxstify-start gap-4">
                <BellIcon width={16} />
                Notifications
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
        )}
        <DropdownMenuGroup>
          <Link className="py-3" href={"/support"}>
            <DropdownMenuItem className="py-3 w-full juxstify-start gap-4">
              <InformationCircleIcon width={16} />
              Support
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <SignedIn>
          <SignOutButton>
            <Button variant={"outline"}>Sign Out</Button>
          </SignOutButton>
        </SignedIn>
        <SignedOut>
          <SignInButton>
            <Button>Sign In</Button>
          </SignInButton>
        </SignedOut>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileButton;
