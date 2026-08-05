"use client";

import { useEffect, useRef, useState } from "react";

export function useScrollDirection() {
  const [direction, setDirection] = useState<"up" | "down">("up");
  const lastY = useRef(0);

  useEffect(() => {
    function onScroll() {
      const currentY = window.scrollY;
      if (currentY > lastY.current && currentY > 60) {
        setDirection("down");
      } else {
        setDirection("up");
      }
      lastY.current = currentY;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return direction;
}
