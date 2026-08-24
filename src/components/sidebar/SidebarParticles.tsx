import { InteractiveObject } from "@/data/interactiveObjects";
import { SidebarPanel } from "./SidebarPanel";

export function SidebarParticles({ object }: { object: InteractiveObject }) {
  return <SidebarPanel object={object} />;
}
