import React, { memo, useCallback, useMemo } from "react";
import { AuthClientData } from "../services/authClientData";
import { LogOut } from "lucide-react";

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
    `text-white cursor-pointer hover:text-red-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 ${className}`,
    [className]
  );

  // Memoizar icono de logout
  const logoutIcon = useMemo(() => (
    <LogOut className="h-4 w-4 mr-2" />
  ), []);

  return (
    <button 
      className={buttonClasses}
      onClick={handleLogout}
      type="button"
      aria-label="Cerrar sesión"
      title="Cerrar sesión"
    >
      <span className="flex items-center text-sm">
        {logoutIcon}
        Cerrar Sesión
      </span>
    </button>
  );
});

ItemAuthLogout.displayName = "ItemAuthLogout";
