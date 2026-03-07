import { create } from "zustand";

interface UserState {
  profile: any;
  touStatus: string;
  setProfile: (profile: any) => void;
  setTouStatus: (status: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  touStatus: "active",
  setProfile: (profile) => set({ profile }),
  setTouStatus: (touStatus) => set({ touStatus }),
}));
