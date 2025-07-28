
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
          className="text-white flex items-center focus:outline-none hover:text-gray-300 transition-colors cursor-pointer"
          onClick={toggleOpen}
          aria-label="Menú de usuario"
        >
          {userIcon}
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded shadow-lg z-50 border border-gray-700 min-w-44">
            <Link
              to={profileUrl}
              className="block px-4 py-2 text-white hover:bg-gray-700 transition-colors"
              onClick={closeDropdown}
            >
              Perfil
            </Link>
            <div className="border-t border-gray-700" />
            <div className="">
              <ItemAuthLogout className="hover:bg-gray-700 transition-colors px-4 py-2 w-full" />
            </div>
          </div>
        )}
      </div>

      {/* Small screens: avatar and logout stacked */}
      <div className="md:hidden flex flex-col items-start gap-5">
        <Link
          to={profileUrl}
          className="text-gray-300 hover:text-white flex items-center rounded transition-colors text-md"
        >
          Mi perfil
        </Link>
        <div>
          <ItemAuthLogout className="text-lg text-gray-300 hover:text-white transition-colors" />
        </div>
      </div>
    </>
  );
});

NavbarAvatar.displayName = "NavbarAvatar";
