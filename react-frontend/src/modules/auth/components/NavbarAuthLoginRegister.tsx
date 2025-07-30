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
      <div className="flex items-center gap-4 justify-between w-full">
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

  // Memoizar iconos
  const loginIcon = useMemo(() => <LogInIcon className="h-4 w-4" />, []);

  const registerIcon = useMemo(() => <UserPlus className="h-4 w-4" />, []);

  return (
    <nav className="flex items-center space-x-6">
      <Link
        to={loginUrl}
        className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 font-medium px-3 py-2 rounded-lg hover:bg-gray-800"
        aria-label="Iniciar sesión"
      >
        {loginIcon}
        <span>Iniciar Sesión</span>
      </Link>
      <Link
        to={registerUrl}
        className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-400 text-white font-medium px-4 py-2 rounded-lg hover:from-teal-600 hover:to-cyan-500 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
        aria-label="Registrarse"
      >
        {registerIcon}
        <span>Registrarse</span>
      </Link>
    </nav>
  );
});

ItemAuthLoginRegister.displayName = "ItemAuthLoginRegister";
