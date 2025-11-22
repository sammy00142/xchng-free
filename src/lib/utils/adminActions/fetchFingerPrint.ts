"use server";

import { DeviceFingerprint } from "@/lib/hooks/useDeviceFingerprint";

export async function fetchFingerprintFromDB(
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

export async function saveFingerprint(
  fingerprint: DeviceFingerprint
): Promise<DeviceFingerprint | null> {
  try {
    const response = await fetch("/api/fingerprint", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fingerprint),
    });
    if (!response.ok) throw new Error("Failed to save fingerprint");
    return await response.json();
  } catch (error) {
    console.error("Error saving fingerprint:", error);
    return null;
  }
}
