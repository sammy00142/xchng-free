import React from "react";
import { Pagination as PaginateClass } from "@/lib/utils/paginate";
import { Button } from "../ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

type Props = {
  cards: PaginateClass;
};

const Paginate = ({ cards }: Props) => {
  return (
    <div>
      <Button
        variant={"ghost"}
        className="border"
        onClick={() => {
          cards.previousPage();
        }}
      >
        <ChevronLeftIcon width={18} />
      </Button>
      <Button
        variant={"ghost"}
        className="border"
        onClick={() => {
          cards.nextPage();
        }}
      >
        <ChevronRightIcon width={18} />
      </Button>
    </div>
  );
};

export default Paginate;
