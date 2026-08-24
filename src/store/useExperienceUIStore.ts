import { create } from "zustand";

interface ExperienceUIState {
  // --- Loading Phase ---
  isLoadingAssets: boolean;
  assetsLoaded: boolean;

  // --- Intro Phase (auto) ---
  isIntroPlaying: boolean;
  introFinished: boolean;

  // --- User Interaction (manual) ---
  hasUserEntered: boolean;

  // --- Experience / Scene Ready ---
  experienceStarted: boolean;

  // --- UI Blocking (hover) ---
  isUIHovered: boolean;

  // --- Setters ---
  setIsLoadingAssets: (v: boolean) => void;
  setAssetsLoaded: (v: boolean) => void;
  setIsIntroPlaying: (v: boolean) => void;
  setIntroFinished: (v: boolean) => void;
  setHasUserEntered: (v: boolean) => void;
  setExperienceStarted: (v: boolean) => void;
  setIsUIHovered: (v: boolean) => void;
}

const useExperienceUIStore = create<ExperienceUIState>((set, get) => {
  const safeSet = <K extends keyof ExperienceUIState>(key: K, value: ExperienceUIState[K]) => {
    if (get()[key] !== value) set({ [key]: value } as Pick<ExperienceUIState, K>);
  };

  return {
    isLoadingAssets: true,
    assetsLoaded: false,

    isIntroPlaying: false,
    introFinished: false,

    hasUserEntered: false,

    experienceStarted: false,

    isUIHovered: false,

    setIsLoadingAssets: (v) => safeSet("isLoadingAssets", v),
    setAssetsLoaded: (v) => safeSet("assetsLoaded", v),
    setIsIntroPlaying: (v) => safeSet("isIntroPlaying", v),
    setIntroFinished: (v) => safeSet("introFinished", v),
    setHasUserEntered: (v) => safeSet("hasUserEntered", v),
    setExperienceStarted: (v) => safeSet("experienceStarted", v),
    setIsUIHovered: (v) => safeSet("isUIHovered", v),
  };
});

export default useExperienceUIStore;
