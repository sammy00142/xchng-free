import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React from "react";

const GetStarted = () => {
  return (
    <Link
      className="cursor-pointer py-3 px-8 rounded-full font-medium text-lg flex align-middle justify-center gap-3 duration-300 bg-primary w-full mx-auto md:mx-0 md:w-fit ring-4 ring-transparent hover:ring-pink-300 dark:hover:ring-pink-900 text-white"
      href={"/sell"}
    >
      Get Started <ArrowRightIcon width={20} />
    </Link>
  );
};

export default GetStarted;
