"use client";

import { Loader } from "@/components/Loader";
import { NavPad } from "@/components/NavPad";
import { ResponsiveHandler } from "@/components/ResponsiveHandler";
import Scene from "@/components/Scene";
import { Sidebar } from "@/components/sidebar/Sidebar";

export default function Home() {
  return (
    <div className="h-screen w-screen">
      <Loader />
      <Scene />
      <NavPad />
      <Sidebar />
      <ResponsiveHandler />
    </div>
  );
}
