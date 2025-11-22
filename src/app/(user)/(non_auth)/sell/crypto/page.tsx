import React from "react";
import { crypto } from "../../../../../../public/data/crypto";
import Link from "next/link";
import Image from "next/image";

const Crypto = () => {
  return (
    <div className="max-w-screen-md mx-auto">
      {crypto.map((crypt, idx) => {
        return (
          <Link
            href={`/sell/crypto/${crypt.id}`}
            key={idx}
            className="p-3 bg-white dark:bg-neutral-900 rounded-[1.3rem] shadow-md shadow-[#fa6ed722] dark:shadow-lg dark:shadow-[#6133541f] grid place-items-center gap-4 border dark:border-neutral-800 hover:border-transparent dark:hover:border-transparent ring-4 ring-transparent hover:ring-pink-400/10"
          >
            <Image
              src={crypt.image}
              width={58}
              height={58}
              alt="Vender Logo"
              className="text-xs"
              priority={true}
            />
            <h4 className="text-xs text-neutral-800 dark:text-white text-center">
              {crypt.name}
            </h4>
          </Link>
        );
      })}
    </div>
  );
};

export default Crypto;
