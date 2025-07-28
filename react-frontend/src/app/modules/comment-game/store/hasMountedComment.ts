import { create } from "zustand";
import { persist } from "zustand/middleware";

interface HasMountedComment {
  hasMounted: boolean;
  setHasMounted: (hasMounted: boolean) => void;
}

export const useHasMountedComment = create<HasMountedComment>()(
  persist(
    (set) => ({
      hasMounted: false,
      setHasMounted: (hasMounted) => set({ hasMounted }),
    }),
    {
      name: "has-mounted-comment-storage", // nombre de la clave en localStorage
      partialize: (state) => ({ hasMounted: state.hasMounted }), // solo guarda el user
    }
  )
);
