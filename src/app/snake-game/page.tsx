"use client";
import dynamic from "next/dynamic";
const SnakeGame = dynamic(() => import("../snake-game"), { ssr: false });
export default function Page() {
  return <SnakeGame />;
}
