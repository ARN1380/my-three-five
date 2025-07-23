"use client";

import dynamic from "next/dynamic";

const TheIco = dynamic(() => import("@/components/TheIco"), {
  ssr: false,
});

export default function Home() {
  return (
    <div>
      <TheIco />
    </div>
  );
}
