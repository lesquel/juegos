import React, { memo, useEffect } from "react";
import { useAuthStore } from "../store/auth.store";

export const SaveAuthProvider: React.FC = memo(() => {
  const { syncWithCookies } = useAuthStore();

  useEffect(() => {
    // Sincronizar con cookies al inicializar la aplicación
    syncWithCookies();
  }, [syncWithCookies]);

  return null;
});

SaveAuthProvider.displayName = "SaveAuthProvider";
