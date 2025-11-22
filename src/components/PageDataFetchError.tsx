"use client";

import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

type Props = {
  error?: any;
};

const PageDataFetchError = ({ error }: Props) => {
  return (
    <div className="text-center p-8">
      <h4 className="text-3xl font-black mb-4">✖️</h4>
      <div className="grid grid-flow-row place-items-center gap-4 align-middle">
        <p className="mb-5 md:text-left md:mb-0 text-3xl md:max-w-sm font-mono text-neutral-400 w-fit p-4 border-l-8 border dark:border-red-700 border-red-400">
          Sorry an error occured
        </p>
        <div className="grid grid-flow-row gap-4 max-w-sm w-full">
          <Button onClick={() => window.location.reload()}>Reload page</Button>
          <Link href={"/sell"}>
            <Button className="w-full" variant={"ghost"}>
              Back to home
            </Button>
          </Link>
        </div>
      </div>
      <div className="w-full grid place-items-center">
        <p className="p-4 rounded-xl md:m-8 m-2 max-w-md text-neutral-800 dark:text-neutral-400 mx-auto bg-neutral-200/70 dark:bg-black font-mono text-left max-h-[35dvh] overflow-scroll">
          {error}
        </p>
      </div>

      <Button variant={"outline"} className="mt-2 w-full md:w-fit">
        <Link href={"/support"}>Send feedback</Link>
      </Button>
    </div>
  );
};

export default PageDataFetchError;
