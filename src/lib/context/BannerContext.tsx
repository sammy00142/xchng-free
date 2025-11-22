"use client";

import { type BannerInfo } from "@/components/banner/banner";
import { useBanner } from "@/hooks/use-banner";
import React, { createContext, useContext, ReactNode } from "react";

interface BannerContextType {
  currentBanner: BannerInfo | null;
  dismissBanner: () => void;
}

const BannerContext = createContext<BannerContextType | undefined>(undefined);

export function BannerProvider({ children }: { children: ReactNode }) {
  const bannerState = useBanner();

  return (
    <BannerContext.Provider value={bannerState}>
      {children}
    </BannerContext.Provider>
  );
}

export function useBannerContext() {
  const context = useContext(BannerContext);
  if (context === undefined) {
    throw new Error("useBannerContext must be used within a BannerProvider");
  }
  
  return context;
}
