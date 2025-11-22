import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import FlashIcon from "../icons/flash-icon";

const Hero = () => {
  return (
    <section
      className="scroller h-[100dvh] min-h-screen bg-purple-100 overflow-y-clip"
      id="money_bag"
    >
      <div className="relative h-full max-h-full flex align-middle place-items-start justify-center md:overflow-x-visible overflow-x-clip max-w-screen-sm mx-auto">
        <div className="flex gap-6 flex-col align-middle place-items-center justify-center mt-32 text-black/80 dark:text-white/80">
          <p className="text-xs font-semibold flex align-middle place-items-center">
            <FlashIcon /> Fast & Reliable
          </p>
          <h4
            style={{ lineHeight: 1.08 }}
            className="text-[3.2rem] max-w-[15rem] font-black dm_serif_display_regular tracking-wide"
          >
            Sell Your Cards for Instant Cash
          </h4>
          <Button className="w-full p-6 font-normal rounded-full bg-black/80 hover:ring-neutral-400/30 dark:hover:ring-neutral-400/20">
            Trade a card
          </Button>
        </div>

        <div className="absolute -bottom-[40%] md:-bottom-[85%] left-1/2 -translate-x-1/2">
          <Image
            src={"/phone-frame.png"}
            alt="money_wallet"
            width={700}
            height={700}
            priority
            fetchPriority="high"
            className=""
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
