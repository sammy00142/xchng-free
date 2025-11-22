"use client";
import React from "react";
import GetStarted from "./ui/get-started";

const Service = () => {
  return (
    <div className="container pb-32 pt-12">
      <div className="max-w-screen-lg mx-auto grid gap-6 justify-center align-middle place-items-center">
        <h1 className="md:text-5xl text-3xl font-extrabold md:px-16">
          We Buy Your Gift Cards & Crypto Currencies For Instant Cash.
        </h1>
        <p className="md:px-16 md:w-[50vw] mx-auto lead">
          We buy Apple iTunes, Google Play, Nordstorm, Steam, Sephora, Amazon,
          Walmart, Visa, American Express and a lot more from various brands and
          countries.
        </p>
        <GetStarted />
      </div>
    </div>
  );
};

export default Service;
