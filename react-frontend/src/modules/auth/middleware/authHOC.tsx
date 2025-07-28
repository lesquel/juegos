import React, { useEffect } from 'react';
import { AuthMiddleware } from './authMiddleware';

/**
 * HOC para proteger rutas que requieren autenticación
 */
export function withAuthRequired<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  const ProtectedComponent: React.FC<P> = (props) => {
    useEffect(() => {
      try {
        AuthMiddleware.requireAuth();
      } catch {
        // El middleware manejará la redirección automáticamente
      }
    }, []);

    return <Component {...props} />;
  };

  ProtectedComponent.displayName = `withAuthRequired(${Component.displayName || Component.name})`;
  
  return ProtectedComponent;
}

/**
 * HOC para proteger rutas de invitados (login/register)
 */
export function withGuestOnly<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  const GuestOnlyComponent: React.FC<P> = (props) => {
    useEffect(() => {
      try {
        AuthMiddleware.requireGuest();
      } catch {
        // El middleware manejará la redirección automáticamente
      }
    }, []);

    return <Component {...props} />;
  };

  GuestOnlyComponent.displayName = `withGuestOnly(${Component.displayName || Component.name})`;
  
  return GuestOnlyComponent;
}

/**
 * Hook personalizado para usar en componentes que necesitan verificar auth
 */
export const useAuthProtection = (requireAuth: boolean = true) => {
  useEffect(() => {
    try {
      if (requireAuth) {
        AuthMiddleware.requireAuth();
      } else {
        AuthMiddleware.requireGuest();
      }
    } catch {
      // El middleware manejará la redirección automáticamente
    }
  }, [requireAuth]);
};
