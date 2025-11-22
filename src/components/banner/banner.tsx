"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { TypeIcon as type, LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";

export type BannerInfo = {
  title?: string;
  body: string;
  actionBtn?: {
    title: string;
    url: string;
    icon: string;
  }[];
  interval: number;
  autoClose: boolean;
};

interface BannerProps {
  bannerInfo: BannerInfo;
  onDismiss: () => void;
}

export function Banner({ bannerInfo, onDismiss }: BannerProps) {
  const { title, body, actionBtn } = bannerInfo;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-primary text-primary-foreground py-3 px-4"
      >
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex-1">
            {title && <h2 className="text-lg font-semibold mb-1">{title}</h2>}
            <p className="text-sm">{body}</p>
          </div>
          <div className="flex items-center space-x-2">
            {actionBtn &&
              actionBtn.map((btn, index) => {
                const IconComponent = Icons[
                  btn.icon as keyof typeof Icons
                ] as LucideIcon;

                return (
                  <Link key={index} href={btn.url}>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex items-center space-x-1"
                    >
                      <IconComponent className="h-4 w-4" />
                      <span>{btn.title}</span>
                    </Button>
                  </Link>
                );
              })}
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="text-primary-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Dismiss</span>
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
