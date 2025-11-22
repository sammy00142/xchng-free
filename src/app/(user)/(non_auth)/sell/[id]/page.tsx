import { api } from "@/trpc/server";
import React from "react";
import type { AssetSelect } from "@/server/db/schema";
import CardSelector from "@/components/giftcard/CardSelector";
import Link from "next/link";

type Props = {
  params: {
    id: string;
  };
};

const GiftcardInfoPage = async ({ params }: Props) => {
  const card = (await api.giftcard.getCardInfo({
    id: params.id,
  })) as AssetSelect;

  if (!card) {
    return (
      <div className="container font-bold text-2xl text-center relative max-w-screen-md pb-6">
        Card not found
      </div>
    );
  }

  return (
    <div className="container font-bold text-lg relative max-w-screen-md pb-6">
      <CardSelector card={card} />

      <div className="mt-10 text-center font-light text-[0.6em]">
        Please read our{" "}
        <Link
          href={"/terms"}
          className=" text-secondary font-semibold underline"
        >
          terms and conditions
        </Link>
      </div>
    </div>
  );
};

export default GiftcardInfoPage;
