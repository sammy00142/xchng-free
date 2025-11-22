"use client";

import { api } from "@/trpc/react";
import Loading from "@/app/loading";
import TradeCard from "@/components/admin/trades/TradeCard";
import { useState } from "react";

const TradesPage = () => {
  const [status] = useState<
    "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED" | "ALL"
  >("ALL");

  const { data: trades, isLoading } = api.trade.getUserTrades.useQuery();

  const filteredTrades = trades?.filter((trade) =>
    status === "ALL" ? true : trade.status === status
  );

  return (
    <div className="duration-300 overflow-hidden">
      {/* <TradesNav
        filteredStatus={status}
        setFilteredStatus={setStatus}
        stats={stats}
      /> */}
      <h4 className="text-2xl font-bold text-center mb-4 pb-16 pt-8 border-b">
        Trades
      </h4>
      <div className="bg-white dark:bg-black flex-col divide-y divide-neutral-200 dark:divide-neutral-800 pb-4 max-w-md mx-auto">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {filteredTrades?.map((trade, idx) => (
              <TradeCard key={trade.id} trade={trade} idx={idx} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default TradesPage;
