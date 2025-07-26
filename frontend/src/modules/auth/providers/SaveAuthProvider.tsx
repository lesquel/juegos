import React, { memo, useEffect, useMemo } from "react";
import { useStore } from "zustand";
import { CookiesSection } from "../utils/cookiesSection";
import { useAuthStore } from "../store/auth.store";

export const SaveAuthProvider: React.FC = memo(() => {
  const setUser = useStore(useAuthStore, (state) => state.setUser);
  
  // Memoizar el usuario de las cookies para evitar accesos repetidos
  const userFromCookies = useMemo(() => {
    return CookiesSection.get();
  }, []);

  useEffect(() => {
    if (userFromCookies) {
      setUser(userFromCookies);
    }
  }, [userFromCookies, setUser]);

  return null;
});

SaveAuthProvider.displayName = "SaveAuthProvider";
