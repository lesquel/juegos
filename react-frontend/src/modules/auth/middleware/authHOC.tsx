import React, { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '../store/auth.store';
import { authRoutesConfig } from '../config/auth.routes.config';

/**
 * HOC para proteger rutas que requieren autenticación
 */
export function withAuthRequired<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  const ProtectedComponent: React.FC<P> = (props) => {
    const navigate = useNavigate();
    const [isChecking, setIsChecking] = useState(true);
    const { isLogged, syncWithCookies } = useAuthStore();

    useEffect(() => {
      const checkAuth = () => {
        if (typeof window === 'undefined') return;
        
        // Sincronizar con cookies en caso de discrepancia
        syncWithCookies();
        
        const isAuthenticated = isLogged();
        
        if (!isAuthenticated) {
          navigate({
            to: authRoutesConfig.children.login.url as '/auth/login',
            search: {
              redirect: window.location.pathname,
            },
          });
        } else {
          setIsChecking(false);
        }
      };

      // Agregar un pequeño delay para asegurar que el store esté hidratado
      const timer = setTimeout(checkAuth, 100);
      
      return () => clearTimeout(timer);
    }, [navigate, isLogged, syncWithCookies]);

    if (isChecking) {
      return <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>;
    }

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
    const navigate = useNavigate();
    const [isChecking, setIsChecking] = useState(true);
    const { isLogged, syncWithCookies } = useAuthStore();

    useEffect(() => {
      const checkAuth = () => {
        if (typeof window === 'undefined') return;
        
        // Sincronizar con cookies en caso de discrepancia
        syncWithCookies();
        
        const isAuthenticated = isLogged();
        
        if (isAuthenticated) {
          navigate({ to: '/' });
        } else {
          setIsChecking(false);
        }
      };

      // Agregar un pequeño delay para asegurar que el store esté hidratado
      const timer = setTimeout(checkAuth, 100);
      
      return () => clearTimeout(timer);
    }, [navigate, isLogged, syncWithCookies]);

    if (isChecking) {
      return <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>;
    }

    return <Component {...props} />;
  };

  GuestOnlyComponent.displayName = `withGuestOnly(${Component.displayName || Component.name})`;
  
  return GuestOnlyComponent;
}

/**
 * Hook personalizado para usar en componentes que necesitan verificar auth
 */
export const useAuthProtection = (requireAuth: boolean = true) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const { isLogged, syncWithCookies } = useAuthStore();

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window === 'undefined') return;
      
      // Sincronizar con cookies en caso de discrepancia
      syncWithCookies();
      
      const isAuthenticated = isLogged();
      
      if (requireAuth && !isAuthenticated) {
        navigate({
          to: authRoutesConfig.children.login.url as '/auth/login',
          search: {
            redirect: window.location.pathname,
          },
        });
      } else if (!requireAuth && isAuthenticated) {
        navigate({ to: '/' });
      } else {
        setIsChecking(false);
      }
    };

    // Agregar un pequeño delay para asegurar que el store esté hidratado
    const timer = setTimeout(checkAuth, 100);
    
    return () => clearTimeout(timer);
  }, [navigate, requireAuth, isLogged, syncWithCookies]);

  return { isChecking };
};
