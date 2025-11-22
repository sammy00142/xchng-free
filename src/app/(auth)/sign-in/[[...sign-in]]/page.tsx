"use client";

import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const backgroundImages = [
  "https://images.unsplash.com/photo-1730649030962-dcdf2c2b7ca7?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1730817965381-c1dce70fa225?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1729695714794-d4850d4506b3?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1729892935767-50bb36a38589?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1730298756164-59881a5b5ef0?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1727004796489-13d75e9cdeff?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1730817965381-c1dce70fa225?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1727004796477-b4239f088748?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1730649030965-0705c9a01fde?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1730817965381-c1dce70fa225?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];
export default function Page() {
  const { theme } = useTheme();
  const [dynamicBackground, setDynamicBackground] = useState<string | null>(
    null
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * backgroundImages.length);

      setDynamicBackground(backgroundImages[randomIndex]);
    }, 1500);

    return () => clearTimeout(timeout);
  }, [theme]);

  return (
    <div
      className="min-h-screen w-full flex place-items-center justify-center py-8 transition-all duration-500 ease-out"
      style={{
        backgroundImage: `url(${dynamicBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="fixed inset-0 bg-gradient-to-t dark:from-black/80 from-white/50 dark:to-black/50 to-white/50" />
      <SignIn
        appearance={{
          baseTheme: theme === "dark" ? dark : undefined,
        }}
        forceRedirectUrl={"/sell"}
        fallbackRedirectUrl={"/sell"}
      />
    </div>
  );
}
