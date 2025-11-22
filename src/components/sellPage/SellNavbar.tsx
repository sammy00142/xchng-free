"use client";
import React, { useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  SignOutButton,
  SignInButton,
  useUser,
  useAuth,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import {
  ArrowLeftIcon,
  SunIcon,
  MoreVertical,
  MessageSquare,
  Receipt,
  User,
  Bell,
  Info,
} from "lucide-react";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { DownloadIcon, MoonIcon } from "@radix-ui/react-icons";

const TITLES: Record<string, string> = {
  "/sell": "Sell",
  "/sell/create": "Create Listing",
  "/sell/manage": "Manage Listings",
  "/sell/orders": "Orders",
};

export default function SellNavbar() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathName = usePathname();
  const { user } = useUser();
  const { userId } = useAuth();

  const pageTitle = TITLES[pathName.split("/").slice(0, 3).join("/")] || "Sell";
  const isInSellFlow = pathName !== "/sell";

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const isSignedIn = userId !== null;

  return (
    <div className="px-4 py-2 mb-4 backdrop-blur-md dark:backdrop-blur-lg sticky top-0 shadow-lg shadow-[#ffacf323] dark:shadow-[#24182a23] bg-[#f5f5f5c0] dark:bg-black z-50 max-w-screen-md mx-auto">
      <NavigationMenu className="flex justify-between items-center">
        <div className="flex items-center">
          {isInSellFlow ? (
            <Button onClick={() => router.back()} variant="ghost" size="icon">
              <ArrowLeftIcon className="w-5 h-5" />
            </Button>
          ) : (
            <Link href="/" className="p-3">
              <Image
                src="/greatexc.svg"
                alt="Great Exchange logo"
                width={30}
                height={30}
              />
            </Link>
          )}
          <h4 className="text-lg font-bold ml-2 capitalize">{pageTitle}</h4>
        </div>

        <div className="flex items-center align-middle place-items-center gap-2">
          <Button
            onClick={toggleTheme}
            variant="outline"
            size="icon"
            className="mr-2 relative"
          >
            <SunIcon
              className={`dark:rotate-[360deg] dark:opacity-0 dark:scale-0 rotate-0 scale-100 opacity-100 w-4 h-4 ease-out duration-500 transition-all absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2`}
            />
            <MoonIcon
              className={`dark:rotate-0 dark:scale-100 dark:opacity-100 opacity-0 scale-0 -rotate-[360deg] w-4 h-4 ease-out duration-500 transition-all absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2`}
            />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div>
                {isSignedIn && user ? (
                  <Button
                    className="bg-neutral-200"
                    variant="outline"
                    size="icon"
                  >
                    <Image
                      src={user.imageUrl}
                      width={58}
                      height={58}
                      alt={user.username ?? "User"}
                      priority
                      className="w-full rounded-full aspect-square object-cover text-[10px]"
                    />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    className="rounded-full border bg-neutral-200 dark:bg-neutral-800"
                    size="icon"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mr-2 z-[9999]">
              {user && (
                <DropdownMenuLabel className="capitalize border-b pb-2 tracking-wider flex place-items-center gap-2 w-full py-1.5 px-2">
                  {user.username}
                </DropdownMenuLabel>
              )}
              <DropdownMenuSeparator />
              <div id="installContainer">
                <DropdownMenuItem
                  id="installButton"
                  className="py-3 w-full justify-start gap-2 hidden"
                >
                  <DownloadIcon className="w-4 h-4" />
                  Install App
                </DropdownMenuItem>
              </div>

              <DropdownMenuItem
                onClick={toggleTheme}
                className="py-3 w-full justify-start gap-2"
              >
                {theme === "dark" ? (
                  <SunIcon className="w-4 h-4" />
                ) : (
                  <MoonIcon className="w-4 h-4" />
                )}
                Toggle Theme
              </DropdownMenuItem>

              <SignedIn>
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    asChild
                    className="py-3 w-full justify-start gap-2"
                  >
                    <Link href="/chat">
                      <MessageSquare className="w-4 h-4" />
                      Chats
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="py-3 w-full justify-start gap-2"
                  >
                    <Link href="/trade">
                      <Receipt className="w-4 h-4" />
                      Transactions
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="py-3 w-full justify-start gap-2"
                  >
                    <Link href="/profile">
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="py-3 w-full justify-start gap-2"
                  >
                    <Link href="/notification">
                      <Bell className="w-4 h-4" />
                      Notifications
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </SignedIn>

              <DropdownMenuGroup>
                <DropdownMenuItem
                  asChild
                  className="py-3 w-full justify-start gap-2"
                >
                  <Link href="/support">
                    <Info className="w-4 h-4" />
                    Support
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <SignedIn>
                <SignOutButton>
                  <Button variant="outline" className="w-full">
                    Sign Out
                  </Button>
                </SignOutButton>
              </SignedIn>
              <SignedOut>
                <SignInButton>
                  <Button className="w-full">Sign In</Button>
                </SignInButton>
              </SignedOut>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </NavigationMenu>
    </div>
  );
}
