'use client'

import { useBannerContext } from "@/lib/context/BannerContext"
import { Banner } from "./banner"


export function TopBanner() {
  const { currentBanner, dismissBanner } = useBannerContext()

  if (!currentBanner) return null

  return (
    <Banner
      bannerInfo={currentBanner}
      onDismiss={dismissBanner}
    />
  )
}

