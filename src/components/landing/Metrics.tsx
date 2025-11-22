import React from "react";

const Metrics = () => {
  return (
    <div className="py-10 md:px-16 px-4 md:flex-row flex-col flex align-middle place-items-center justify-center md:gap-[7em] gap-8">
      <div>
        <h4 className="md:text-2xl text-xl font-serif italic">
          Fast and reliable payouts
        </h4>
      </div>
      <div className="md:border-r border-t border-white w-full md:w-0 md:h-12 border-opacity-40" />
      <div className="flex md:flex-row flex-col align-middle justify-between place-items-center gap-16">
        <div>
          <h4 className="md:text-4xl text-3xl md:mb-4 font-bold">5 min</h4>
          <p className="text-sm md:text-base">Delay</p>
        </div>
        <div>
          <h4 className="md:text-4xl text-3xl md:mb-4 font-bold">0</h4>
          <p className="text-sm md:text-base">Scams Reported</p>
        </div>
        <div>
          <h4 className="md:text-4xl text-3xl md:mb-4 font-bold">0</h4>
          <p className="text-sm md:text-base">Ripping</p>
        </div>
      </div>
    </div>
  );
};

export default Metrics;
