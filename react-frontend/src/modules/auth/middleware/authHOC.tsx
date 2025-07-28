import React, { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { CookiesSection } from '../utils/cookiesSection';
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

    useEffect(() => {
      const checkAuth = () => {
        if (typeof window === 'undefined') return;
        
        const hasSession = CookiesSection.get();
        
        if (!hasSession) {
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

      checkAuth();
    }, [navigate]);

    if (isChecking) {
      return <div>Loading...</div>;
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

    useEffect(() => {
      const checkAuth = () => {
        if (typeof window === 'undefined') return;
        
        const hasSession = CookiesSection.get();
        
        if (hasSession) {
          navigate({ to: '/' });
        } else {
          setIsChecking(false);
        }
      };

      checkAuth();
    }, [navigate]);

    if (isChecking) {
      return <div>Loading...</div>;
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

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window === 'undefined') return;
      
      const hasSession = CookiesSection.get();
      
      if (requireAuth && !hasSession) {
        navigate({
          to: authRoutesConfig.children.login.url as '/auth/login',
          search: {
            redirect: window.location.pathname,
          },
        });
      } else if (!requireAuth && hasSession) {
        navigate({ to: '/' });
      } else {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [requireAuth, navigate]);

  return { isChecking };
};
