import Image from "next/image";
import React from "react";

const CardSpread = () => {
  return (
    <div className="h-[100vh] grid place-items-center relative">
      <div className="p-8 bg-red-200 rounded-2xl absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[90%] text-left">
        <h4 className="font-bold text-2xl dm_serif_display_regular">
          Fast & Reliable
        </h4>
        <p className="text-sm text-black/60">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Placeat,
          autem!
        </p>
        <div className="">
          <Image
            src={"/hero_images/money_bag.png"}
            alt=""
            className="w-full"
            width={1000}
            height={1000}
          />
        </div>
      </div>
      <div className="p-8 bg-purple-200 rounded-2xl absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[90%] text-left">
        <h4 className="font-bold text-2xl dm_serif_display_regular">
          Fast & Reliable
        </h4>
        <p className="text-sm text-black/60">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Placeat,
          autem!
        </p>
        <div className="">
          <Image
            src={"/hero_images/smiley.png"}
            alt=""
            className="w-full"
            width={1000}
            height={1000}
          />
        </div>
      </div>
      <div className="p-8 bg-green-200 rounded-2xl absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[90%] text-left">
        <h4 className="font-bold text-2xl dm_serif_display_regular">
          Fast & Reliable
        </h4>
        <p className="text-sm text-black/60">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Placeat,
          autem!
        </p>
        <div className="">
          <Image
            src={"/hero_images/phone_dollar.png"}
            alt=""
            className="w-full"
            width={1000}
            height={1000}
          />
        </div>
      </div>
      <div className="p-8 bg-yellow-200 rounded-2xl absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[90%] text-left">
        <h4 className="font-bold text-2xl dm_serif_display_regular">
          Fast & Reliable
        </h4>
        <p className="text-sm text-black/60">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Placeat,
          autem!
        </p>
        <div className="">
          <Image
            src={"/hero_images/money_wallet.png"}
            alt=""
            className="w-full"
            width={1000}
            height={1000}
          />
        </div>
      </div>
    </div>
  );
};

export default CardSpread;
