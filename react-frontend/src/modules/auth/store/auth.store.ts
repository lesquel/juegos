import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserMe } from "@modules/user/models/user.model";
import { CookiesSection } from "../utils/cookiesSection";

interface AuthStore {
  user: UserMe | null;
  setUser: (user: UserMe) => void;
  clearUser: () => void;
  isLogged: () => boolean;
  syncWithCookies: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => {
        // Sincronizar con cookies cuando se establece el usuario
        CookiesSection.set(user);
        set({ user });
      },
      clearUser: () => {
        // Limpiar tanto el store como las cookies
        CookiesSection.remove();
        set({ user: null });
      },
      isLogged: () => {
        // Verificar tanto el store como las cookies para mayor consistencia
        const storeUser = get().user;
        const cookieUser = CookiesSection.get();
        
        // Si hay discrepancia, sincronizar
        if (storeUser && !cookieUser) {
          // El store tiene usuario pero no hay cookie - limpiar store
          set({ user: null });
          return false;
        }
        
        if (!storeUser && cookieUser) {
          // Hay cookie pero no store - sincronizar
          set({ user: cookieUser });
          return true;
        }
        
        return !!storeUser;
      },
      syncWithCookies: () => {
        // Función para sincronizar manualmente con cookies
        const cookieUser = CookiesSection.get();
        const storeUser = get().user;
        
        if (cookieUser && !storeUser) {
          set({ user: cookieUser });
        } else if (!cookieUser && storeUser) {
          set({ user: null });
        }
      },
    }),
    {
      name: "auth-storage", // nombre de la clave en localStorage
      partialize: (state) => ({ user: state.user }), // solo guarda el user
    }
  )
);
