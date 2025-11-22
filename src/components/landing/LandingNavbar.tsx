"use client";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import { Button } from "../ui/button";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import Cookies from "js-cookie";
import type { User } from "firebase/auth";
import {
  ArrowRightIcon,
  ChevronRightIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { MenuIcon } from "lucide-react";
export default function LandingNavbar() {
  const [open, setOpen] = useState(false);
  const cachedUser = Cookies.get("user");
  const user = cachedUser ? (JSON.parse(cachedUser) as User) : null;

  return (
    <div className="py-3 sticky top-0 z-[99999] md:px-24 bg-white text-black shadow-sm">
      <NavigationMenu className="max-w-screen-xl mx-auto relative">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="md:hidden flex" size={"icon"}>
              <MenuIcon size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent className="z-[99999] w-screen">
            <div className="h-full first-letter:overflow-hidden">
              <div className="flex align-middle place-items-center gap-2 pb-4 border-b mb-4  w-full">
                <Image
                  width={35}
                  height={35}
                  src={"/greatexc.svg"}
                  alt="Great Exchange"
                />
                <h4 className="text-lg font-semibold">Great Exchange</h4>
              </div>

              <ul className="grid grid-flow-row place-items-start gap-2 w-full">
                <SheetClose className="w-full">
                  <Link
                    className="rounded-2xl w-full bg-primary duration-200 group px-3 py-2.5 flex align-middle place-items-center justify-between"
                    href={"/sell"}
                  >
                    <li>Sell a Gift card</li>
                    <CurrencyDollarIcon
                      width={22}
                      className="group-hover:opacity-70 opacity-0 mr-2 duration-200 group group-hover:mr-0"
                      color="white"
                    />
                  </Link>
                </SheetClose>
                <SheetClose className="w-full">
                  <Link
                    className="rounded-2xl w-full hover:bg-neutral-100 duration-200 group px-3 py-2.5 border border-transparent hover:border-neutral-600 flex align-middle place-items-center justify-between"
                    href={"/sell/crypto"}
                  >
                    <li>Crypto currencies</li>
                    <ChevronRightIcon
                      width={14}
                      className="group-hover:opacity-70 opacity-0 mr-2 duration-200 group group-hover:mr-0"
                      color="white"
                    />
                  </Link>
                </SheetClose>
                <SheetClose className="w-full">
                  <Link
                    className="rounded-2xl w-full hover:bg-neutral-100 duration-200 group px-3 py-2.5 border border-transparent hover:border-neutral-600 flex align-middle place-items-center justify-between"
                    href={"#about-us"}
                  >
                    <li>About Us</li>
                    <ChevronRightIcon
                      width={14}
                      className="group-hover:opacity-70 opacity-0 mr-2 duration-200 group group-hover:mr-0"
                      color="white"
                    />
                  </Link>
                </SheetClose>
                <SheetClose className="w-full">
                  <Link
                    className="rounded-2xl w-full hover:bg-neutral-100 duration-200 group px-3 py-2.5 border border-transparent hover:border-neutral-600 flex align-middle place-items-center justify-between"
                    href={"/terms"}
                  >
                    <li>Terms & Policies</li>
                    <ChevronRightIcon
                      width={14}
                      className="group-hover:opacity-70 opacity-0 mr-2 duration-200 group group-hover:mr-0"
                      color="white"
                    />
                  </Link>
                </SheetClose>
                <SheetClose className="w-full">
                  <Link
                    className="rounded-2xl w-full hover:bg-neutral-100 duration-200 group px-3 py-2.5 border border-transparent hover:border-neutral-600 flex align-middle place-items-center justify-between"
                    href={"/sign-in"}
                  >
                    <li>Login</li>
                    <ChevronRightIcon
                      width={14}
                      className="group-hover:opacity-70 opacity-0 mr-2 duration-200 group group-hover:mr-0"
                      color="white"
                    />
                  </Link>
                </SheetClose>
              </ul>
            </div>
          </SheetContent>
        </Sheet>

        <Link
          href={"/"}
          className="flex align-middle place-items-center gap-2 mx-auto md:mx-0"
        >
          <Image
            width={25}
            height={25}
            src={"/greatexc.svg"}
            alt="Great Exchange"
          />
          <h4 className="text-lg font-bold">Great Exchange</h4>
        </Link>

        <NavigationMenuList className="hidden md:flex">
          <Link
            href="#about-us"
            className="bg-transparent p-2 border border-transparent transition-colors duration-300 rounded-2xl px-6 hover:bg-neutral-100 hover:border-neutral-300 dark:hover:border-neutral-800"
          >
            About Us
          </Link>
          <Link
            href="/terms"
            className="bg-transparent p-2 border border-transparent transition-colors duration-300 rounded-2xl px-6 hover:bg-neutral-100 hover:border-neutral-300 dark:hover:border-neutral-800"
          >
            Terms & Policies
          </Link>
        </NavigationMenuList>

        {user ? (
          <Link className="sm:flex hidden" href="/sell">
            <Button className="px-10 rounded-2xl">Sell</Button>
          </Link>
        ) : (
          <Link className="sm:flex hidden" href="/sign-in">
            <Button className="px-10 rounded-2xl">Login</Button>
          </Link>
        )}
      </NavigationMenu>
    </div>
  );
}
