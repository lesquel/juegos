import { NavbarAvatar } from "@modules/user/components/NavbarAvatar";
import { authRoutesConfig } from "../config/auth.routes.config";
import { useAuthStore } from "../store/auth.store";
import { ItemAuthLogout } from "./ItemAuthLogout";
import { useStore } from "zustand";
import { useEffect, useState } from "react";

export const NarbarAuthLoginRegister = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const isLogged = useStore(useAuthStore, (state) => state.isLogged());
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null; // o un <Skeleton /> si prefieres
  return isLogged ? (
    <>
      <ItemAuthLogout />
      <NavbarAvatar />
    </>
  ) : (
    <ItemAuthLoginRegister />
  );
};

const ItemAuthLoginRegister = () => {
  return (
    <>
      <a href={authRoutesConfig.children.login.url}>Login</a>
      <a href={authRoutesConfig.children.register.url}>Register</a>
    </>
  );
};
