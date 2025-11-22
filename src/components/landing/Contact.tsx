import Image from "next/image";
import React from "react";
import Link from "next/link";

const Contact = () => {
  return (
    <section className="bg-white text-left dark:bg-black py-24">
      <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
        <div className="place-self-center lg:col-span-7">
          <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
            Questions? Let s talk
          </h1>
          <p className="max-w-lg mb-6 font-light text-neutral-500 lg:mb-8  dark:text-neutral-400 my-12 para">
            Contact us through out 24/7 live chat. We&apos;re always happy to
            help
          </p>
          <Link
            href={"/support"}
            className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white bg-secondary rounded-full focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900 ring-4 ring-transparent hover:ring-fuchsia-300 duration-300 hover:px-6 hover:shadow-xl shadow-purple-200"
          >
            Send us a message
            <svg
              className="w-5 h-5 ml-2 -mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </Link>
        </div>
        <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
          <Image
            width={400}
            height={400}
            src="/bnsbitcoin.png"
            alt="mockup"
            className="rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
};

export default Contact;
