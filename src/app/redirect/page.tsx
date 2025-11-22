"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Redirect() {
  const [countdown, setCountdown] = useState(5);

  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) =>
        prevCountdown === 0 ? 0 : prevCountdown - 1
      );

      if (countdown === 0) {
        router.push("/sell");
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown, router]);

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Unauthorized Access
        </h1>
        <p className="mt-4 text-muted-foreground">
          You are not authorized to access this content. Please log in to
          continue.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2">
          <Link href="/sign-in">
            <Button className="w-full sm:w-auto">Log In</Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="outline" className="w-full sm:w-auto">
              Sign Up
            </Button>
          </Link>
        </div>
        <div className="mt-6 rounded-md bg-muted px-4 py-3 text-center text-sm font-medium text-muted-foreground">
          <span className="font-bold text-foreground">
            Redirecting to giftcards page in{" "}
          </span>
          <span id="countdown" className="font-bold text-foreground">
            {countdown}
          </span>
          <span className="font-bold text-foreground"> seconds</span>
        </div>
      </div>
    </div>
  );
}
