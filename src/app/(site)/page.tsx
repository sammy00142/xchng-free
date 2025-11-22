"use client";

import dynamic from "next/dynamic";

// Lazy load components that are below the fold
const Features = dynamic(() => import("@/components/landing/features-section"));
const HeroSection = dynamic(() => import("@/components/landing/scroll-hero"));
const BrandScroller = dynamic(
  () => import("@/components/landing/brand-scroller-section")
);
const ProductShowcase = dynamic(
  () => import("@/components/landing/product-showcase-section")
);
const CallToAction = dynamic(
  () => import("@/components/landing/call-to-action-section")
);
const Footer = dynamic(() => import("@/components/landing/footer-section"));
const FAQSection = dynamic(() => import("@/components/landing/faq-section"));

export default function Home() {
  const primaryBrands = [
    "https://d38v990enafbk6.cloudfront.net/Adidas.png",
    "https://d38v990enafbk6.cloudfront.net/Apple.png",
    "https://d38v990enafbk6.cloudfront.net/banana_republic.png",
    "https://d38v990enafbk6.cloudfront.net/Apple.png",
    "https://d38v990enafbk6.cloudfront.net/Blizzard.png",
  ];

  const secondaryBrands = [
    "https://d38v990enafbk6.cloudfront.net/Ebay.png",
    "https://d38v990enafbk6.cloudfront.net/Gamestop.png",
    "https://d38v990enafbk6.cloudfront.net/Playstore.png",
    "https://d38v990enafbk6.cloudfront.net/Starbucks.png",
    "https://d38v990enafbk6.cloudfront.net/Target.png",
  ];

  return (
    <main className="text-center bg-white text-black">
      <HeroSection />
      <Features />
      <div className="flex justify-center items-center place-items-center p-4 gap-4">
        <BrandScroller
          speed="fast"
          items={primaryBrands}
          pauseOnHover={false}
        />
        <BrandScroller
          items={secondaryBrands}
          speed="normal"
          direction="right"
          pauseOnHover={false}
        />
      </div>
      <CallToAction />
      <ProductShowcase />
      <FAQSection />
      <Footer />
    </main>
  );
}
