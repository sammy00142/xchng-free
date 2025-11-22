import Image from "next/image";
import React from "react";

type FeatureCardType = {
  title: string;
  bgColor: string;
  textColor: string;
  description: string;
  images: {
    src: string;
    alt: string;
    width: number;
    height: number;
    className: string;
  }[];
  offSetTop?: string;
  mclass: string;
};

const featureCards: FeatureCardType[] = [
  {
    mclass: "active:rotate-[6deg] duration-500 hover:-mt-3",
    title: "Lightning-Fast Transactions",
    bgColor: "bg-[#C3B2E7]",
    textColor: "text-purple-950",
    description:
      "Experience lightning-fast transaction times when you use our in-app chat feature. Trade efficiently, every time.",
    images: [
      {
        src: "/bolts.png",
        alt: "placeholder1",
        width: 733,
        height: 986,
        className: "rounded-md !shadow-none w-[84%] rotate-[-4deg] mx-auto",
      },
    ],
  },
  {
    mclass: "hover:rotate-[-6deg] active:-mt-8 duration-500 hover:-mt-3",
    title: "Ultimate Flexibility",
    bgColor: "bg-[#F682A5]",
    textColor: "text-pink-950",
    description:
      "Negotiate the best rates that suit your needs. We offer ultimate flexibility to ensure you get the best deal.",
    images: [
      {
        src: "/chat_face.png",
        alt: "placeholder1",
        width: 1000,
        height: 386,
        className: "mx-auto rounded-md shadow-sm w-[96%]",
      },
    ],
  },
  {
    mclass: "active:rotate-[360deg] active:scale-90 duration-500 hover:-mt-3",
    title: "Unmatched Versatility",
    bgColor: "bg-[#F9A474]",
    textColor: "text-orange-950",
    description:
      "Got a gift card? We’ll buy it! Enjoy unmatched versatility with our comprehensive purchasing options.",
    images: [
      {
        src: "/collection.png",
        alt: "placeholder1",
        width: 370,
        height: 486,
        className: "rotate-[-15deg]",
      },
      {
        src: "/sr_collection.png",
        alt: "placeholder1",
        width: 333,
        height: 386,
        className: "rotate-[4deg] mr-2",
      },
    ],
  },
  {
    mclass: "hover:rotate-[6deg] duration-500 hover:-mt-3",
    title: "Comprehensive Inbox",
    bgColor: "bg-[#FEDF6F]",
    textColor: "text-orange-950",
    description:
      "Easily track your gift card and cryptocurrency transactions, conversation histories, and more—all in one place.",
    images: [
      {
        src: "/inbox.svg",
        alt: "placeholder1",
        width: 633,
        height: 886,
        className: "rounded-md shadow-sm",
      },
    ],
  },
  {
    mclass: "hover:rotate-[6deg] duration-500 hover:-mt-3",
    title: "Top-Notch Security",
    bgColor: "bg-[#B8CEDC]",
    textColor: "text-blue-950",
    description:
      "Trade with confidence and peace of mind. Our secure web app prioritizes your privacy at every step.",
    images: [
      {
        src: "/sec_lock.png",
        alt: "placeholder1",
        width: 433,
        height: 433,
        className: " ml-10 w-[84%] rounded-md !shadow-none ",
      },
    ],
  },

  {
    mclass: "hover:rotate-[6deg] duration-500 hover:-mt-3",
    title: "Hassle-Free Refunds",
    bgColor: "bg-[#C9DA8F] hidden md:grid",
    textColor: "text-orange-950",
    description:
      "Your satisfaction is our priority. If things don't go as planned, we offer hassle-free refunds to ensure a great trading experience.",
    images: [
      {
        src: "/placeholder1.png",
        alt: "placeholder1",
        width: 133,
        height: 186,
        className: "rotate-[-15deg] rounded-md shadow-sm",
      },
      {
        src: "/placeholder2.png",
        alt: "placeholder1",
        width: 133,
        height: 186,
        className: "rotate-[4deg] mr-2 rounded-md shadow-sm",
      },
    ],
  },
];

const Features = () => {
  return (
    <div className="mb-14 mt-32 md:mt-32 grid gap-8 px-4 place-items-center justify-center align-middle relative">
      <div className="w-[270px] md:w-[350px] md:text-5xl text-center text-zinc-800 text-3xl font-extrabold">
        Explore endless possibilities.
      </div>
      <div className="grid gap-4 md:gap-8 md:grid-cols-3 md:p-16">
        {featureCards.map((card, index) => {
          return (
            <div
              key={index}
              className={`feature__card ${card.bgColor} ${card.offSetTop} slide-in-from-top-px sticky top-28 p-6 rounded-2xl text-left overflow-y-clip h-[30rem] md:h-[28rem] grid gap-6 place-items-start align-start justify-start hover-95 duration-500 active:scale-95 focus:scale-95`}
            >
              <div className="grid gap-2">
                <h4 className={`text-xl font-bold ${card.textColor}`}>
                  {card.title}
                </h4>
                <p className="text-sm text-black/60 font-normal">
                  {card.description}
                </p>
              </div>
              <div className="flex align-middle justify-center place-items-center w-full">
                {card.images.map((image, imgIndex) => (
                  <div key={imgIndex} className={card.mclass}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      className={`shadow-xl ${image.className}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Features;
