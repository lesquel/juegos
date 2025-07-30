import React, { memo, useEffect, useState, useMemo } from "react";
import { useStore } from "zustand";
import { Link } from "@tanstack/react-router";
import { NavbarAvatar } from "@modules/user/components/NavbarAvatar";
import { authRoutesConfig } from "../config/auth.routes.config";
import { useAuthStore } from "../store/auth.store";
import { LogInIcon, UserPlus } from "lucide-react";
import { LinkMyTransfer } from "@/modules/transfers/components/LinkMyTransfer";

export const NavbarAuthLoginRegister: React.FC = memo(() => {
  const [hasMounted, setHasMounted] = useState(false);
  const isLogged = useStore(useAuthStore, (state) => state.isLogged());
  const user = useStore(useAuthStore, (state) => state.user);

  useEffect(() => {
    setHasMounted(true);
  }, [isLogged, user]);

  const content = useMemo(() => {
    if (!hasMounted) {
      return null;
    }

    return (
      <div className="flex items-center gap-6 sm:gap-8 lg:gap-10 xl:gap-12 justify-between w-full">
        {isLogged ? (
          <>
            <NavbarAvatar />
            {/* <LinkMyTransfer />  */}
          </>
        ) : (
          <ItemAuthLoginRegister />
        )}
      </div>
    );
  }, [hasMounted, isLogged]);

  return content;
});

NavbarAuthLoginRegister.displayName = "NavbarAuthLoginRegister";

const ItemAuthLoginRegister: React.FC = memo(() => {
  // Memoizar URLs de rutas
  const loginUrl = useMemo(() => authRoutesConfig.children.login.url, []);
  const registerUrl = useMemo(() => authRoutesConfig.children.register.url, []);

  return (
    <nav className="flex items-center space-x-8 sm:space-x-10 lg:space-x-12 xl:space-x-16">
      <Link
        to={loginUrl}
        className="flex items-center gap-3 sm:gap-4 lg:gap-5 text-gray-300 hover:text-white transition-colors duration-300 font-medium px-4 sm:px-5 lg:px-6 xl:px-7 py-3 sm:py-4 lg:py-5 rounded-2xl hover:bg-gray-800 text-lg sm:text-xl lg:text-2xl xl:text-3xl"
        aria-label="Iniciar sesión"
      >
        <LogInIcon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8" />
        <span>Iniciar Sesión</span>
      </Link>
      <Link
        to={registerUrl}
        className="flex items-center gap-3 sm:gap-4 lg:gap-5 bg-gradient-to-r from-teal-500 to-cyan-400 text-white font-medium px-6 sm:px-7 lg:px-8 xl:px-10 py-3 sm:py-4 lg:py-5 xl:py-6 rounded-2xl hover:from-teal-600 hover:to-cyan-500 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg text-lg sm:text-xl lg:text-2xl xl:text-3xl"
        aria-label="Registrarse"
      >
        <UserPlus className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8" />
        <span>Registrarse</span>
      </Link>
    </nav>
  );
});

ItemAuthLoginRegister.displayName = "ItemAuthLoginRegister";
