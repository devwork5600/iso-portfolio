import { create } from "zustand";

interface InteractionState {
  hoveredObject: string | null;
  clickedObject: string | null;

  setHoveredObject: (name: string | null) => void;
  setClickedObject: (name: string | null) => void;
}

const useInteractionStore = create<InteractionState>((set, get) => ({
  hoveredObject: null,
  clickedObject: null,

  setHoveredObject: (name) => {
    if (get().hoveredObject === name) return;
    set({ hoveredObject: name });
  },

  setClickedObject: (name) => {
    if (get().clickedObject === name) return;
    set({ clickedObject: name });
  },
}));

export default useInteractionStore;
