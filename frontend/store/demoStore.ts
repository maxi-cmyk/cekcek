import { create } from "zustand";

interface DemoState {
  isActive: boolean;
  toggleDemo: () => void;
}

export const useDemoStore = create<DemoState>((set) => ({
  isActive: false,
  toggleDemo: () => set((state) => ({ isActive: !state.isActive })),
}));
