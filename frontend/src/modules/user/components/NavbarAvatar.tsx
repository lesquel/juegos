
import { useState, useRef, useEffect } from "react";
import { User } from "lucide-react";
import { userRoutesConfig } from "../config/user.routes.config";
import { ItemAuthLogout } from "@modules/auth/components/ItemAuthLogout";

export const NavbarAvatar = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <>
      {/* Large screens: dropdown */}
      <div className="hidden md:block relative" ref={dropdownRef}>
        <button
          className="text-white flex items-center focus:outline-none"
          onClick={() => setOpen((v) => !v)}
        >
          <User />
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded shadow-lg z-50">
            <a
              href={userRoutesConfig.children.me.url}
              className="block px-4 py-2 text-white hover:bg-gray-700"
              onClick={() => setOpen(false)}
            >

              Perfil
            </a>
            <div className="border-t border-gray-700" />
            <div className="px-4 py-2">
              <ItemAuthLogout className="hover:bg-gray-700" />
            </div>
          </div>
        )}
      </div>

      {/* Small screens: avatar and logout stacked */}
      <div className="md:hidden flex flex-col items-start gap-2">
        <a
          href={userRoutesConfig.children.me.url}
          className="text-gray-300 hover:text-white flex items-center rounded transition-colors text-lg"
        >
          Mi perfil
        </a>
        <div>
          <ItemAuthLogout className="text-lg text-gray-300 hover:text-white" />
        </div>
      </div>
    </>
  );
};
