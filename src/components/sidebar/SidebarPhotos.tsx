import { InteractiveObject } from "@/data/interactiveObjects";
import { SidebarPanel } from "./SidebarPanel";

export function SidebarPhotos({ object }: { object: InteractiveObject }) {
  return <SidebarPanel object={object} />;
}
