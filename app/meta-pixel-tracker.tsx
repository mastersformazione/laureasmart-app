"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { trackMetaEvent } from "../lib/data/metaPixel";

export default function MetaPixelTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackMetaEvent("PageView", undefined, true);
  }, [pathname]);

  return null;
}
