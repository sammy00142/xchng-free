import LandingNavbar from "@/components/landing/LandingNavbar";
import React from "react";
import { toAdd } from "../../../public/data/cards.new";
import { api } from "@/trpc/server";

type Props = {
  children: React.ReactNode;
};

const cards = toAdd;

const LandingLayout = (props: Props) => {
  async () => {
    cards.forEach(async(card) => {
      try {
        await api.giftcard.create({
          ...card,
          type: "GIFTCARD",
        });

        console.log("UPLOADED:: ", card.name);
      } catch (error) {
        console.error(
          "[UPLOAD_CARD_INTERNAL_ERROR]::  FOR => ",
          card.name,
          error
        );
      }
    });
  };

  return (
    <>
      <LandingNavbar />
      {props.children}
      {/* <Footer /> */}
    </>
  );
};

export default LandingLayout;
