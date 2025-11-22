"use client";
import { ReactNode, useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
}: {
  words: string;
  className?: string;
}) => {
  const [scope, animate] = useAnimate();
  let wordsArray = words?.toString().split(" ");
  useEffect(() => {
    animate(
      "span",
      {
        opacity: 1,
      },
      {
        duration: 1.4,
        delay: stagger(0.2),
      }
    );
  }, [animate]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return <motion.span key={word + idx}>{word} </motion.span>;
        })}
      </motion.div>
    );
  };

  return (
    <div>
      <div>
        <div className="md:text-xl text-base font-medium text-black/60 dark:text-white/60">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
