"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SlidingPuzzleRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/sliding-puzzle/select-mode");
  }, [router]);
  return null;
}
