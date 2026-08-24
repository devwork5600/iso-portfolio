import { InteractiveObject } from "@/data/interactiveObjects";
import { SidebarPanel } from "./SidebarPanel";

export function SidebarLibrary({ object }: { object: InteractiveObject }) {
  return <SidebarPanel object={object} />;
}
