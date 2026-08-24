import { InteractiveObject } from "@/data/interactiveObjects";
import { SidebarPanel } from "./SidebarPanel";

export function SidebarClock({ object }: { object: InteractiveObject }) {
  return <SidebarPanel object={object} />;
}
