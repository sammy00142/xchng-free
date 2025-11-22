import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { XMarkIcon } from "@heroicons/react/20/solid";

type Props = {
  filteredStatus: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED" | "ALL";
  setFilteredStatus: (status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED" | "ALL") => void;
  stats?: {
    totalTrades: number;
    pendingTrades: number;
    activeTrades: number;
    completedTrades: number;
    cancelledTrades: number;
  };
};

const TradesNav = ({ filteredStatus, setFilteredStatus, stats }: Props) => {
  return (
    <nav className="container my-2 px-4 flex align-middle justify-between place-items-center">
      <DropdownMenu>
        {filteredStatus !== "ALL" ? (
          <Button
            className="flex align-middle place-items-center font-light text-xs text-neutral-00 rounded-lg hover:bg-neutral-300 dark:hover:bg-black group bg-neutral-200 capitalize gap-2"
            variant={"ghost"}
            onClick={() => setFilteredStatus("ALL")}
          >
            {filteredStatus.toLowerCase()}
            <XMarkIcon
              className="group-hover:bg-neutral-400 p-1 rounded-full duration-150"
              color="#222"
              width={20}
            />
          </Button>
        ) : (
          <DropdownMenuTrigger
            className={`flex align-middle place-items-center font-light text-xs text-neutral-00 py-2 px-4 rounded-lg hover:bg-neutral-300 dark:hover:bg-black border ${
              filteredStatus !== "ALL" ? "bg-neutral-200 dark:bg-black" : ""
            } focus-visible:outline-none group duration-150`}
          >
            <Button
              className="p-0 h-fit hover:bg-transparent capitalize gap-2 flex"
              variant={"ghost"}
            >
              {filteredStatus.toLowerCase()} <CaretSortIcon width={22} />
            </Button>
          </DropdownMenuTrigger>
        )}
        <DropdownMenuContent className="mr-2">
          <DropdownMenuItem
            className="py-3 px-4"
            onClick={() => setFilteredStatus("ALL")}
          >
            All {stats && <span className="ml-2">({stats.totalTrades})</span>}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="py-3 px-4"
            onClick={() => setFilteredStatus("COMPLETED")}
          >
            Completed {stats && <span className="ml-2">({stats.completedTrades})</span>}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="py-3 px-4"
            onClick={() => setFilteredStatus("PENDING")}
          >
            Pending {stats && <span className="ml-2">({stats.pendingTrades})</span>}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="py-3 px-4"
            onClick={() => setFilteredStatus("ACTIVE")}
          >
            Active {stats && <span className="ml-2">({stats.activeTrades})</span>}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="py-3 px-4"
            onClick={() => setFilteredStatus("CANCELLED")}
          >
            Cancelled {stats && <span className="ml-2">({stats.cancelledTrades})</span>}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};

export default TradesNav;
