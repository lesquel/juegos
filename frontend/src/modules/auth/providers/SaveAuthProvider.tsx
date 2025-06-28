import { useEffect } from "react";
import { CookiesSection } from "../utils/cookiesSection";
import { useStore } from "zustand";
import { useAuthStore } from "../store/auth.store";

export const SaveAuthProvider = () => {
  const setUser = useStore(useAuthStore, (state) => state.setUser);
  const user = CookiesSection.get();
  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, []);
  return <></>;
};
