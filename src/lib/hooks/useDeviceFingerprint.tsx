"use client";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { useEffect, useState } from "react";

export interface DeviceFingerprint {
  visitorId: string;
  components: Record<string, any>;
}

async function fetchFingerprintFromDB(
  visitorId: string
): Promise<DeviceFingerprint | null> {
  try {
    const response = await fetch("/api/fingerprint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId }),
    });
    if (!response.ok) throw new Error("Failed to fetch fingerprint");
    return await response.json();
  } catch (error) {
    console.error("Error fetching fingerprint:", error);
    return null;
  }
}

export function useDeviceFingerprint(): string | null {
  const [fingerprint, setFingerprint] = useState<string | null>(null);

  useEffect(() => {
    async function getFingerprint() {
      const fp = await FingerprintJS.load();
      const result = await fp.get();

      const storedFingerprint = await fetchFingerprintFromDB(result.visitorId);

      if (storedFingerprint) {
        console.log("Fingerprint match found in database");
        setFingerprint(storedFingerprint.visitorId);
      } else {
        console.log("No matching fingerprint found, saving new fingerprint");
        // const savedFingerprint = await saveFingerprint(result);
        // if (savedFingerprint) {
        //   setFingerprint(savedFingerprint.visitorId);
        // }
      }
    }

    getFingerprint();
  }, []);

  return fingerprint;
}
