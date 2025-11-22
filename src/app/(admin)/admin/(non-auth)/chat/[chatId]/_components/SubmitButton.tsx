"use client";

import { Button } from "@/components/ui/button";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { SunIcon } from "@radix-ui/react-icons";
import React from "react";

type Props = {
  pending: boolean;
  edit: boolean;
  updateConvo: () => void;
};

const SubmitButton = ({ edit, pending, updateConvo }: Props) => {
  return (
    <Button
      size={"icon"}
      title="Send Message"
      variant={"secondary"}
      disabled={pending || edit}
      onClick={() => {
        updateConvo();
      }}
      type="submit"
      className="focus:outline-none col-span-2 duration-300 w-full h-full py-1 grid place-items-center align-middle rounded-r-lg p-2 disabled:cursor-not-allowed"
    >
      {pending ? (
        <SunIcon width={22} className="animate-spin" />
      ) : (
        <PaperAirplaneIcon width={25} />
      )}
    </Button>
  );
};

export default SubmitButton;
