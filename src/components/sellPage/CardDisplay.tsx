import { AssetSelect } from "@/server/db/schema";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  filteredCards: AssetSelect[];
};

const CardDisplay = ({ filteredCards }: Props) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-7 duration-200 px-4">
      {filteredCards.map((giftCard, idx) => {
        return (
          <Link
            href={`/sell/${giftCard.id}`}
            key={idx}
            className="p-3 bg-white dark:bg-neutral-900 rounded-[1.3rem] shadow-md shadow-[#fa6ed722] dark:shadow-lg dark:shadow-[#6133541f] grid place-items-center gap-4 border dark:border-neutral-800 hover:border-transparent dark:hover:border-transparent ring-4 ring-transparent hover:ring-pink-400/10"
          >
            <Image
              src={giftCard.coverImage || "/logoplace.svg"}
              width={58}
              height={58}
              alt="Vender Logo"
              className="text-xs"
              priority={true}
            />
            <h4 className="text-xs text-neutral-800 dark:text-white text-center">
              {giftCard.name}
            </h4>
          </Link>
        );
      })}
    </div>
  );
};

export default CardDisplay;
