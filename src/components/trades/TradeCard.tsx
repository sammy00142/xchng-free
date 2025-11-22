import React from "react";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils/thousandSeperator";
import type { TradeWithRelations } from "@/server/db/schema";

type Props = {
  trade: TradeWithRelations;
  idx: number;
};

const TradeCard = ({ idx, trade }: Props) => {
  return (
    <Link
      href={`/trades/${trade.id}`}
      key={idx}
      className="flex gap-4 align-middle place-items-center justify-between py-3 px-4 hover:bg-neutral-200 dark:hover:bg-black duration-100 ease-in cursor-pointer h-fit max-w-lg w-full mx-auto"
    >
      <Image
        className="self-center"
        src={trade.asset?.coverImage || "/logoplace.svg"}
        width={40}
        height={40}
        alt="asset"
      />

      <div className="place-self-start w-full">
        <h4 className="">
          {trade.asset?.name}
          <span className="font-semibold text-neutral-500 dark:text-neutral-400">
            - {formatCurrency(trade.amountInCurrency ?? "0")}
          </span>
        </h4>
        <p className="text-[12px] font-light text-neutral-400">
          {trade.currency}
        </p>
      </div>
      <div
        className={`w-fit grid gap-1 self-center text-center place-items-center ${
          trade.status === "COMPLETED"
            ? "text-green-600"
            : trade.status === "PENDING"
            ? "text-orange-400"
            : trade.status === "ACTIVE"
            ? "text-yellow-500"
            : "text-red-600"
        }`}
      >
        <span className="text-[12px] uppercase font-bold text-right">
          {trade.status}
        </span>
      </div>
    </Link>
  );
};

export default TradeCard;
