"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import {
  EllipsisVerticalIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/solid";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotificationStatus } from "@/lib/utils/store/notifications";

type Props = {
  handleClose?: () => void;
};

const TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/chat": "Chat",
  "/admin/transactions": "Transactions",
  "/admin/reports": "Reports",
};

export default function AdminNavbar({ handleClose }: Readonly<Props>) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathName = usePathname();
  const { user } = useUser();
  const { isSubscribed } = useNotificationStatus();
  const [permission, setPermission] = useState<PermissionState | null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then(async (registration) => {
        setPermission(
          (await registration?.pushManager.permissionState()) ?? null
        );
      });
    }
  }, []);

  const pageTitle =
    TITLES[pathName.split("/").slice(0, 3).join("/")] || "Dashboard";
  const isInChat = /^\/admin\/chat\/.+$/.test(pathName);

  const handleNotificationClick = useCallback(() => {
    router.push("/notification");
  }, [router]);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return (
    <div className="px-2 py-2 mb-4 backdrop-blur-md dark:backdrop-blur-lg sticky top-0 shadow-lg shadow-[#ffacf323] dark:shadow-[#24182a23] bg-[#f5f5f5c0] dark:bg-black z-50 max-w-screen-md mx-auto">
      <NavigationMenu className="flex justify-between items-center">
        <div className="flex items-center">
          {isInChat ? (
            <Button onClick={() => router.back()} variant="ghost" size="icon">
              <ArrowLeftIcon className="w-5 h-5" />
            </Button>
          ) : (
            <Link href="/admin" className="p-3">
              <Image
                src="/greatexc.svg"
                alt="Great Exchange logo"
                width={30}
                height={30}
              />
            </Link>
          )}
          <h4 className="text-lg font-bold ml-2">{pageTitle}</h4>
        </div>

        <div className="flex items-center">
          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="icon"
            className="mr-2"
          >
            {theme === "dark" ? (
              <SunIcon className="w-5 h-5" />
            ) : (
              <MoonIcon className="w-5 h-5" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                {!isSubscribed && permission !== "granted" && (
                  <span className="absolute top-2 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
                <EllipsisVerticalIcon className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mr-2 z-[9999]">
              <DropdownMenuLabel>
                <p className="text-sm">
                  Howdy,{" "}
                  <span className="capitalize">
                    {user?.username ?? "Admin"}
                  </span>
                </p>
                <p className="text-neutral-500 text-xs">You are an admin</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {isInChat ? (
                <DropdownMenuItem onClick={handleClose} asChild>
                  <Button variant="ghost" className="w-full py-3 text-left">
                    Close chat
                  </Button>
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/advanced-settings" className="py-3">
                      Advanced settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleNotificationClick}
                    className="py-3 relative"
                  >
                    {permission === "denied" ? (
                      "Allow notifications"
                    ) : (
                      <div className="flex justify-between items-center w-full">
                        Notifications
                        <span
                          className={`text-xs font-bold ${
                            isSubscribed ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {isSubscribed ? "Active" : "Not subscribed"}
                        </span>
                      </div>
                    )}
                    {!isSubscribed && permission !== "granted" && (
                      <span className="absolute top-2 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <SignOutButton>
                    <DropdownMenuItem className="w-full py-3 flex items-center justify-between text-primary border border-primary bg-pink-100 font-semibold dark:bg-pink-500 dark:bg-opacity-10">
                      Sign Out
                    </DropdownMenuItem>
                  </SignOutButton>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </NavigationMenu>
    </div>
  );
}
