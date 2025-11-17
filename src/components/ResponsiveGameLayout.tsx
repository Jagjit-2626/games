"use client";
import React, { useRef, useEffect, useState } from "react";

// ResponsiveGameLayout: 16:9 aspect ratio, fills viewport, no scrollbars
export function ResponsiveGameLayout({ children, bgClass = "bg-white/80" }: { children: React.ReactNode, bgClass?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function handleResize() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let width = vw;
      let height = vw / (16 / 9);
      if (height > vh) {
        height = vh;
        width = vh * (16 / 9);
      }
      setDimensions({ width, height });
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Add vertical margin (5vw or 32px min) above and below the game area
  const verticalMargin = Math.max(window.innerHeight * 0.05, 32);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-green-200 to-blue-300 overflow-hidden"
      style={{ minHeight: "100vh", minWidth: "100vw" }}
    >
      <div
        className={`flex flex-col items-center justify-center w-full h-full ${bgClass}`}
        style={{
          width: "100vw",
          height: "100vh",
          aspectRatio: undefined,
          maxWidth: undefined,
          maxHeight: undefined,
          marginTop: 0,
          marginBottom: 0,
          borderRadius: 0,
          boxShadow: "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}
