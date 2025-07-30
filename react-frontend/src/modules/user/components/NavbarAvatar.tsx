
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
          className="p-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white flex items-center focus:outline-none hover:bg-white/15 focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300 cursor-pointer group"
          onClick={toggleOpen}
          aria-label="Menú de usuario"
        >
          <div className="text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300">
            {userIcon}
          </div>
        </button>
        {open && (
          <div className="absolute right-0 mt-3 w-48 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10"></div>
            <div className="relative">
              <Link
                to={profileUrl}
                className="block px-4 py-3 text-white hover:bg-white/10 transition-all duration-300 border-b border-white/10 group"
                onClick={closeDropdown}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                  <span className="group-hover:text-cyan-300 transition-colors duration-300">Perfil</span>
                </div>
              </Link>
              <div className="px-4 py-3">
                <ItemAuthLogout className="hover:bg-white/10 transition-all duration-300 px-0 py-0 w-full rounded-lg flex items-center gap-3 group" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Small screens: avatar and logout stacked */}
      <div className="md:hidden flex flex-col items-start gap-5">
        <Link
          to={profileUrl}
          className="group flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 hover:bg-white/15 transition-all duration-300"
        >
          <div className="w-2 h-2 bg-cyan-400 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
          <span className="text-gray-300 group-hover:text-cyan-300 transition-colors duration-300 text-md">
            Mi perfil
          </span>
        </Link>
        <div className="w-full">
          <ItemAuthLogout className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 hover:bg-white/15 text-lg text-gray-300 hover:text-red-300 transition-all duration-300 w-full" />
        </div>
      </div>
    </>
  );
});

NavbarAvatar.displayName = "NavbarAvatar";
