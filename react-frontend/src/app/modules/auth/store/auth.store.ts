import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserMe } from "@modules/user/models/user.model";

interface AuthStore {
  user: UserMe | null;
  setUser: (user: UserMe) => void;
  clearUser: () => void;
  isLogged: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      isLogged: () => !!get().user,
    }),
    {
      name: "auth-storage", // nombre de la clave en localStorage
      partialize: (state) => ({ user: state.user }), // solo guarda el user
    }
  )
);
