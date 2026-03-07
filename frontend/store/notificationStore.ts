import { create } from "zustand";

interface NotificationState {
  queue: string[];
  addNotification: (message: string) => void;
  clearQueue: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  queue: [],
  addNotification: (message) =>
    set((state) => ({ queue: [...state.queue, message] })),
  clearQueue: () => set({ queue: [] }),
}));
