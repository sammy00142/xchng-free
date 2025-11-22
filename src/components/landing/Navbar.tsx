"use client";
import Image from "next/image";
import React, { useContext, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    title: "Gift cards",
    link: "/sell/giftcard",
  },
  {
    title: "Crypto Currency",
    link: "/sell/crypto",
  },
  {
    title: "Our Terms",
    link: "/terms",
  },
  {
    title: "FAQs",
    link: "/faq",
  },
];

const Navbar = () => {
  const pathName = usePathname();

  const navTabs = tabs.map((tab, idx) => {
    return (
      <Link
        key={idx}
        href={tab.link}
        className={`border-b-2 h-fit py-1 duration-300 align-middle grid place-items-center ${
          tab.link === pathName
            ? "border-b-pink-400"
            : "border-b-transparent hover:border-b-neutral-300"
        }`}
      >
        {tab.title}
      </Link>
    );
  });

  return (
    <nav className="bg-white bg-opacity-90 dark:bg-opacity-95 backdrop-blur-md dark:bg-black py-6 left-0 right-0 z-50 sticky top-0">
      <div className="mx-auto max-w-screen-lg flex flex-wrap justify-between items-center">
        <div className=" flex justify-start items-center">
          <button className="p-2 mr-2 text-neutral-600 rounded-lg cursor-pointer md:hidden hover:text-neutral-900 hover:bg-neutral-100 focus:bg-neutral-100 dark:focus:bg-black focus:ring-2 focus:ring-neutral-100 dark:focus:ring-neutral-700 dark:text-neutral-400 dark:hover:bg-black dark:hover:text-white">
            <svg
              aria-hidden="true"
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
            <svg
              aria-hidden="true"
              className="hidden w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Toggle sidebar</span>
          </button>
          <a href="/" className="flex items-center justify-between mr-4">
            <Image
              width={25}
              height={25}
              src="/greatexc-logo.svg"
              className="mr-3 h-8"
              alt="Flowbite Logo"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              Great Exchange
            </span>
          </a>
        </div>

        <nav className="grid-flow-col gap-6 hidden md:grid place-items-center">
          {navTabs}
        </nav>

        <Link href={"/sign-in"}>
          <button
            className="px-8 py-3 bg-pink-500 rounded-full text-white hover:bg-pink-400 duration-300 border border-transparent hover:border-pink-600"
            style={{ fontWeight: "500" }}
          >
            Login
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
