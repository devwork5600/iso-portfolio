import { create } from "zustand";

interface MorphStore {
  targetIndex: number;
  isAnimating: boolean;

  setTargetIndex: (index: number) => void;
  setIsAnimating: (value: boolean) => void;
}

export const useMorphStore = create<MorphStore>((set) => ({
  targetIndex: 0,
  isAnimating: false,

  setTargetIndex: (index) => set((state) => (state.isAnimating ? state : { targetIndex: index })),

  setIsAnimating: (value) => set({ isAnimating: value }),
}));
