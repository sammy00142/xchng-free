import Image from "next/image";
import React from "react";
import GetStarted from "./ui/get-started";

const Cwu = () => {
  return (
    <div>
      <h4 className="md:text-4xl text-3xl font-extrabold py-8 mt-8 px-8 md:px-4 my-12">
        Chat with us live
      </h4>

      <div className="bg-orange-200/40 w-fit rounded-t-2xl mx-auto overflow-clip">
        <div className="mx-auto">
          <Image
            alt="phone mockup"
            width={2000}
            height={2000}
            src={"/Image.png"}
            className="w-[90vw]"
          />
        </div>
      </div>
      <div className="w-full grid place-items-center p-6">
        <GetStarted />
      </div>
    </div>
  );
};

export default Cwu;
