import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

const AboutUs = () => {
  return (
    <div id="about-us" className="md:p-0 p-8">
      <div className="pt-32"></div>
      <div className="w-[270px] md:w-[350px] md:text-5xl text-center text-zinc-800 text-3xl font-extrabold mx-auto border-b-4 border-r-4 border p-4 rounded-md">
        A Little About Us
      </div>
      <div className="md:h-[60vh] mt-16 grid grid-flow-row md:grid-flow-col md:grid-cols-2 align-middle place-items-center gap-16 max-w-screen-lg mx-auto px-0 md:px-8">
        <div className="px-8 py-16 rounded-3xl w-full h-full bg-pink-200">
          <Image
            src={"/bitcoininhandonaboutsection.png"}
            alt={"Bitcoin in hand on about section"}
            width={400}
            height={400}
          />
        </div>
        <div className="md:text-left text-center grid gap-6 md:max-w-lg">
          <h4 className="text-4xl font-extrabold">
            We Buy Your Gift Cards & Crypto Currencies For Instant Cash.
          </h4>
          <p className="text-base text-black/50 dark:text-white/60">
            We buy Apple iTunes, Google Play, Nordstorm, Steam, Sephora, Amazon,
            Walmart, Visa, American Express and a lot more from various brands
            and countries.
          </p>
          <Link href="/sell" className="w-full md:mx-0 mx-auto max-w-md">
            <Button className="py-6 w-full">Trade a card</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
