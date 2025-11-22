import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeftIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import Loader from "@/components/Loader";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { CaretSortIcon } from "@radix-ui/react-icons";

type Props = {
  filteredStatus: string;
  setFilteredStatus: React.Dispatch<React.SetStateAction<string>>;
};

const TransactionNavbar = ({ filteredStatus, setFilteredStatus }: Props) => {
  const router = useRouter();

  return (
    <nav className="container my-2 px-4 flex align-middle justify-between place-items-center">
      <div className="flex align-middle justify-between place-items-center">
        <Button
          variant={"ghost"}
          className="border px-2"
          onClick={() => router.back()}
        >
          <ArrowLeftIcon width={22} />
        </Button>
      </div>
      <DropdownMenu>
        {filteredStatus !== "all" ? (
          <Button
            className="flex align-middle place-items-center font-light text-xs text-neutral-00 rounded-lg hover:bg-neutral-300 dark:hover:bg-black group bg-neutral-200 capitalize gap-2"
            variant={"ghost"}
            onClick={() => setFilteredStatus("all")}
          >
            {filteredStatus}
            <XMarkIcon
              className="group-hover:bg-neutral-400 p-1 rounded-full duration-150"
              color="#222"
              width={20}
            />
          </Button>
        ) : (
          <DropdownMenuTrigger
            className={`flex align-middle place-items-center font-light text-xs text-neutral-00 py-2 px-4 rounded-lg hover:bg-neutral-300 dark:hover:bg-black border ${
              filteredStatus !== "all" ? "bg-neutral-200 dark:bg-black" : ""
            }  focus-visible:outline-none group duration-150`}
          >
            <Button
              className="p-0 h-fit hover:bg-transparent capitalize gap-2 flex"
              variant={"ghost"}
            >
              {filteredStatus} <CaretSortIcon width={22} />
            </Button>
          </DropdownMenuTrigger>
        )}
        <DropdownMenuContent className="mr-2">
          <DropdownMenuItem
            className="py-3 px-4"
            onClick={() => {
              setFilteredStatus("all");
            }}
          >
            All
          </DropdownMenuItem>
          <DropdownMenuItem
            className="py-3 px-4"
            onClick={() => {
              setFilteredStatus("done");
            }}
          >
            Done
          </DropdownMenuItem>
          <DropdownMenuItem
            className="py-3 px-4"
            onClick={() => {
              setFilteredStatus("pending");
            }}
          >
            Pending
          </DropdownMenuItem>
          <DropdownMenuItem
            className="py-3 px-4"
            onClick={() => {
              setFilteredStatus("processing");
            }}
          >
            Processing
          </DropdownMenuItem>
          <DropdownMenuItem
            className="py-3 px-4"
            onClick={() => {
              setFilteredStatus("cancelled");
            }}
          >
            Cancelled
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};

export default TransactionNavbar;
