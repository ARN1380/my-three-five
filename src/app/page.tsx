"use client";

import dynamic from "next/dynamic";

const TheIco = dynamic(() => import("@/components/TheIco"), {
  ssr: false,
});
const TheEarth = dynamic(() => import("@/components/TheEarth"), {
  ssr: false,
});

export default function Home() {
  return (
    <div>
      <TheEarth />
      {/* <TheIco /> */}
    </div>
  );
}
