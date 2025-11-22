import Image from "next/image";
import React from "react";
import GetStarted from "./ui/get-started";

const ServiceDetail = () => {
  return (
    <div>
      <section className="text-left py-24 px-4 md:px-16">
        <div className="grid max-w-screen-lg mx-auto md:gap-8 md:grid-cols-12 gap-12">
          <div className="md:justify-self-end justify-self-start md:mt-0 md:col-span-5 md:flex">
            <Image
              width={200}
              height={400}
              src="/bnscards.png"
              alt="mockup"
              className="rounded-2xl w-screen md:min-w-full"
            />
          </div>
          <div className="gap-6 grid md:place-self-center place-self-start md:col-span-7 md:ml-6">
            <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight md:text-5xl xl:text-6xl dark:text-white text-center md:text-left">
              Exchange Giftcards
            </h1>
            <p className="max-w-xl text-center md:text-left">
              Great Exchange offers you a secure way to trade your gift cards to
              physical cash giving you detailed guides lines and great rates.
            </p>
            <GetStarted />
          </div>
        </div>
      </section>
      <section className="text-left py-24 px-4 md:px-16">
        <div className="grid max-w-screen-lg mx-auto md:gap-8 md:grid-cols-12 gap-12">
          <div className="md:justify-self-end justify-self-start md:mt-0 md:col-span-5 md:flex md:order-1 -order-last">
            <Image
              width={200}
              height={400}
              src="/bnsbitcoin.png"
              alt="mockup"
              className="rounded-2xl w-screen md:min-w-full"
            />
          </div>
          <div className="gap-6 grid md:place-self-center place-self-start md:col-span-7">
            <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white text-center md:text-left">
              Buy & Sell Bitcoin
            </h1>
            <p className="max-w-xl text-center md:text-left">
              Crypto Currency is the future of money, and it is already becoming
              the world&apos;s leading industry in terms of market capital, that
              is why we at Geat Exchange are offering you a great means to trade
              your Crypto Currencies.
            </p>
            <GetStarted />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
