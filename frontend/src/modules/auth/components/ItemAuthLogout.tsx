import React, { memo, useCallback, useMemo } from "react";
import { AuthClientData } from "../services/authClientData";

interface ItemAuthLogoutProps {
  className?: string;
}

export const ItemAuthLogout: React.FC<ItemAuthLogoutProps> = memo(({ className = "" }) => {
  // Memoizar función de logout
  const handleLogout = useCallback(() => {
    AuthClientData.logout();
  }, []);

  // Memoizar clases CSS
  const buttonClasses = useMemo(() => 
    `text-white cursor-pointer hover:text-red-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded px-2 py-1 ${className}`,
    [className]
  );

  // Memoizar icono de logout
  const logoutIcon = useMemo(() => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 mr-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
  ), []);

  return (
    <button 
      className={buttonClasses}
      onClick={handleLogout}
      type="button"
      aria-label="Cerrar sesión"
      title="Cerrar sesión"
    >
      <span className="flex items-center">
        {logoutIcon}
        Cerrar Sesión
      </span>
    </button>
  );
});

ItemAuthLogout.displayName = "ItemAuthLogout";
