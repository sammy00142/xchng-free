"use client";
import { useState, useEffect } from "react";

// Define type for media query results
type DeviceType = "mb" | "tb" | "dsk";

// Define breakpoints
const breakpoints = {
  mobile: "(max-width: 767px)",
  tablet: "(min-width: 768px) and (max-width: 1024px)",
  desktop: "(min-width: 1025px)",
};

// Custom hook to get the current device type based on screen width
const useMediaQuery = (): DeviceType => {
  const getDeviceType = (): DeviceType => {
    if (typeof window === "undefined") {
      // Return default value if window is not defined (e.g., during SSR)
      return "dsk";
    }

    if (window.matchMedia(breakpoints.mobile).matches) {
      return "mb";
    } else if (window.matchMedia(breakpoints.tablet).matches) {
      return "tb";
    } else if (window.matchMedia(breakpoints.desktop).matches) {
      return "dsk";
    }
    return "dsk"; // default to desktop if no match
  };

  const [deviceType, setDeviceType] = useState<DeviceType>(getDeviceType);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setDeviceType(getDeviceType());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return deviceType;
};

export default useMediaQuery;
