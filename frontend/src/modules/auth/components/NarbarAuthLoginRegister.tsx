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
      {/* <LinkMyTransfer /> */}
    </>
  ) : (
    <ItemAuthLoginRegister />
  );
};

const ItemAuthLoginRegister = () => {
  return (
    <div className="space-x-8">
      <a
        href={authRoutesConfig.children.login.url}
        className="text-gray-300 hover:text-white transition-colors duration-300"
      >
        Login
      </a>
      <a
        href={authRoutesConfig.children.register.url}
        className="text-gray-300 hover:text-white transition-colors duration-300"
      >
        Register
      </a>
    </div>
  );
};
