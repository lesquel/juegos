import React, { memo, useEffect, useState, useMemo } from "react";
import { useStore } from "zustand";
import { NavbarAvatar } from "@modules/user/components/NavbarAvatar";
import { authRoutesConfig } from "../config/auth.routes.config";
import { useAuthStore } from "../store/auth.store";

export const NavbarAuthLoginRegister: React.FC = memo(() => {
  const [hasMounted, setHasMounted] = useState(false);
  const isLogged = useStore(useAuthStore, (state) => state.isLogged());
  
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Memoizar el contenido renderizado
  const content = useMemo(() => {
    if (!hasMounted) return null;
    
    return isLogged ? (
      <>
        <NavbarAvatar />
        {/* <LinkMyTransfer /> */}
      </>
    ) : (
      <ItemAuthLoginRegister />
    );
  }, [hasMounted, isLogged]);

  return content;
});

NavbarAuthLoginRegister.displayName = "NavbarAuthLoginRegister";

const ItemAuthLoginRegister: React.FC = memo(() => {
  // Memoizar URLs de rutas
  const loginUrl = useMemo(() => authRoutesConfig.children.login.url, []);
  const registerUrl = useMemo(() => authRoutesConfig.children.register.url, []);

  // Memoizar iconos SVG
  const loginIcon = useMemo(() => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
      />
    </svg>
  ), []);

  const registerIcon = useMemo(() => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
      />
    </svg>
  ), []);

  return (
    <nav className="flex items-center space-x-6">
      <a
        href={loginUrl}
        className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 font-medium px-3 py-2 rounded-lg hover:bg-gray-800"
        aria-label="Iniciar sesión"
      >
        {loginIcon}
        <span>Iniciar Sesión</span>
      </a>
      <a
        href={registerUrl}
        className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-400 text-white font-medium px-4 py-2 rounded-lg hover:from-teal-600 hover:to-cyan-500 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
        aria-label="Registrarse"
      >
        {registerIcon}
        <span>Registrarse</span>
      </a>
    </nav>
  );
});

ItemAuthLoginRegister.displayName = "ItemAuthLoginRegister";
