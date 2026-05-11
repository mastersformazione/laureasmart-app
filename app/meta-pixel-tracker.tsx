"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

type MetaPixelFunction = (
  command: string,
  eventName: string,
  params?: Record<string, string | number | boolean>
) => void;

declare global {
  interface Window {
    fbq?: MetaPixelFunction;
  }
}

export default function MetaPixelTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  }, [pathname]);

  return null;
}
