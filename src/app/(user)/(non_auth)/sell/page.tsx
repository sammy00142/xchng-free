import { api } from "@/trpc/server";
import React from "react";
import AllGiftcard from "./_components/all-giftcards";
import { AssetSelect } from "@/server/db/schema";
import SearchBar from "@/components/sellPage/SearchBar";

const SellPage = async () => {
  const giftcards = (await api.giftcard.getAllCards()) as AssetSelect[];
  console.log("GIFTCARDS: ", giftcards.length);

  if (!giftcards) {
    return (
      <div className={"h-[60dvh] grid place-items-center justify-center"}>
        We have no cards to show
      </div>
    );
  }

  return (
    <div>
      <SearchBar cards={giftcards} />
      <AllGiftcard cards={giftcards} />
    </div>
  );
};

export default SellPage;