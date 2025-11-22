"use client";
import React from "react";
import { Button } from "../ui/button";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  return (
    <Button size={"icon"} onClick={() => router.back()} variant={"ghost"}>
      <ArrowLeftIcon width={20} />
    </Button>
  );
};

export default BackButton;
