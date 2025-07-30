
import { useState, useRef, useEffect, memo, useCallback, useMemo } from "react";
import { User } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { userRoutesConfig } from "../config/user.routes.config";
import { ItemAuthLogout } from "@modules/auth/components/ItemAuthLogout";

export const NavbarAvatar = memo(() => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Memoizar funciones callback
  const toggleOpen = useCallback(() => {
    setOpen(v => !v);
  }, []);

  const closeDropdown = useCallback(() => {
    setOpen(false);
  }, []);

  // Memoizar el handler de click fuera
  const handleOutsideClick = useCallback((e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  // Memoizar el icono de usuario
  const userIcon = useMemo(() => <User />, []);

  // Memoizar la URL del perfil
  const profileUrl = useMemo(() => userRoutesConfig.children.me.url, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open, handleOutsideClick]);

  return (
    <>
      {/* Large screens: dropdown */}
      <div className="hidden md:block relative" ref={dropdownRef}>
        <button
          className="p-4 sm:p-5 lg:p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white flex items-center focus:outline-none hover:bg-white/15 focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300 cursor-pointer group"
          onClick={toggleOpen}
          aria-label="Menú de usuario"
        >
          <div className="text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300 text-2xl sm:text-3xl lg:text-4xl">
            {userIcon}
          </div>
        </button>
        {open && (
          <div className="absolute right-0 mt-4 sm:mt-5 lg:mt-6 w-56 sm:w-60 lg:w-64 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl z-50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10"></div>
            <div className="relative">
              <Link
                to={profileUrl}
                className="block px-6 sm:px-7 lg:px-8 py-4 sm:py-5 lg:py-6 text-white hover:bg-white/10 transition-all duration-300 border-b border-white/10 group"
                onClick={closeDropdown}
              >
                <div className="flex items-center gap-4 sm:gap-5 lg:gap-6">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 bg-cyan-400 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                  <span className="group-hover:text-cyan-300 transition-colors duration-300 text-lg sm:text-xl lg:text-2xl font-semibold">Perfil</span>
                </div>
              </Link>
              <div className="px-6 sm:px-7 lg:px-8 py-4 sm:py-5 lg:py-6">
                <ItemAuthLogout className="hover:bg-white/10 transition-all duration-300 px-0 py-0 w-full rounded-xl flex items-center gap-4 sm:gap-5 lg:gap-6 group text-lg sm:text-xl lg:text-2xl" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Small screens: avatar and logout stacked */}
      <div className="md:hidden flex flex-col items-start gap-8 sm:gap-10">
        <Link
          to={profileUrl}
          className="group flex items-center gap-4 sm:gap-5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 sm:px-7 py-4 sm:py-5 hover:bg-white/15 transition-all duration-300"
        >
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-cyan-400 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
          <span className="text-gray-300 group-hover:text-cyan-300 transition-colors duration-300 text-lg sm:text-xl lg:text-2xl font-semibold">
            Mi perfil
          </span>
        </Link>
        <div className="w-full">
          <ItemAuthLogout className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 sm:px-7 py-4 sm:py-5 hover:bg-white/15 text-xl sm:text-2xl text-gray-300 hover:text-red-300 transition-all duration-300 w-full" />
        </div>
      </div>
    </>
  );
});

NavbarAvatar.displayName = "NavbarAvatar";
