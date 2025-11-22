"use client";

import PageDataFetchError from "@/components/PageDataFetchError";
import { useEffect } from "react";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <PageDataFetchError error={error.message} />;
}
