import Loader from "@/components/Loader";
import React from "react";

const Loading = () => {
  return (
    <div className="w-full h-[100dvh] bg-white dark:bg-[#00000089] bg-opacity-10 backdrop-blur-sm absolute top-0 left-0 z-[99999] grid place-items-center align-middle">
      <div className="p-4 rounded-lg bg-white dark:bg-neutral-900 shadow-2xl dark:shadow-lg dark: shadow-pink-200 dark:shadow-[#43262f60] ">
        <Loader />
      </div>
    </div>
  );
};

export default Loading;
