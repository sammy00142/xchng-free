import React from "react";
import Image from "next/image";

const currenciesSymbol = {
  USD: "$",
  NGN: "₦",
  EUR: "€",
  GBP: "£",
  AUD: "A$",
  CAD: "C$",
  JPY: "¥",
};

interface ChatAssetInfoProps {
  asset?:
    | {
        id: string;
        name: string;
        createdAt: Date | null;
        updatedAt: Date | null;
        type: "CRYPTO" | "GIFTCARD";
        description: string | null;
        coverImage: string | null;
        quote: string | null;
        category: string | null;
        featured: boolean;
        popular: boolean;
        tradeCount: number;
      }
    | null
    | undefined;
  trade?:
    | {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        assetId: string;
        chatId: string;
        currency: "NGN" | "USD" | "EUR" | "GBP" | "AUD" | "CAD" | "JPY";
        status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
        amountInCurrency: string | null;
        amountInNGN: string | null;
      }
    | undefined;
}

export const ChatAssetInfo: React.FC<ChatAssetInfoProps> = ({
  asset,
  trade,
}) => {
  return (
    <div className="py-4 px-4 border-b border-neutral-200 dark:border-neutral-800 flex flex-col gap-2 align-middle place-items-center justify-between mb-4">
      <div className="flex flex-col justify-center place-items-center">
        <Image
          src={asset?.coverImage ?? "/logoplace.svg"}
          alt={asset?.name ?? "Vendor Logo"}
          width={40}
          height={40}
        />
        <h2 className="font-semibold">{asset?.name}</h2>
      </div>
      <div>
        <h4>
          {currenciesSymbol[trade?.currency ?? "USD"]}
          {trade?.amountInCurrency}
        </h4>
        {trade?.amountInNGN && <h4>NGN{trade?.amountInNGN}</h4>}
      </div>
    </div>
  );
};
