"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { type BannerInfo } from "@/components/banner/banner";
import { bannerInfoList } from "../../public/data/banner-info";

const BLACKLIST_ROUTES = ["/login", "/signup", "/checkout"]; // Add your blacklisted routes here

export function useBanner() {
  const [currentBanner, setCurrentBanner] = useState<BannerInfo | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const checkBanners = () => {
      const currentTime = new Date().getTime();

      for (const banner of bannerInfoList) {
        const lastShownTime = localStorage.getItem(
          `lastBannerShownTime_${banner.body}`
        );

        if (
          !lastShownTime ||
          currentTime - parseInt(lastShownTime) > banner.interval
        ) {
          if (!BLACKLIST_ROUTES.some((route) => pathname.startsWith(route))) {
            setCurrentBanner(banner);
            localStorage.setItem(
              `lastBannerShownTime_${banner.body}`,
              currentTime.toString()
            );

            if (banner.autoClose) {
              setTimeout(() => {
                dismissBanner();
              }, 10000); // Auto close after 10 seconds
            }

            break; // Show only one banner at a time
          }
        }
      }
    };

    checkBanners();
    const intervalId = setInterval(checkBanners, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [pathname]);

  const dismissBanner = () => {
    setCurrentBanner(null);
  };

  return { currentBanner, dismissBanner };
}
