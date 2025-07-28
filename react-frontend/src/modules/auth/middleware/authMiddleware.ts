import { redirect } from '@tanstack/react-router';
import { CookiesSection } from '../utils/cookiesSection';
import { authRoutesConfig } from '../config/auth.routes.config';

export class AuthMiddleware {
  /**
   * Middleware para rutas que requieren autenticación
   * Redirige al login si el usuario no está autenticado
   */
  static requireAuth() {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') return;
    
    const hasSession = CookiesSection.get();
    
    if (!hasSession) {
      throw redirect({
        to: authRoutesConfig.children.login.url as '/auth/login',
        search: {
          redirect: window.location.pathname,
        },
      });
    }
  }

  /**
   * Middleware para rutas de autenticación (login/register)
   * Redirige al home si el usuario ya está autenticado
   */
  static requireGuest() {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') return;
    
    const hasSession = CookiesSection.get();
    
    if (hasSession) {
      throw redirect({
        to: '/',
      });
    }
  }

  /**
   * Hook para verificar estado de autenticación en componentes
   */
  static useAuthCheck() {
    return {
      isAuthenticated: () => {
        if (typeof window === 'undefined') return false;
        return !!CookiesSection.get();
      },
      logout: () => {
        CookiesSection.remove();
        throw redirect({
          to: authRoutesConfig.children.login.url as '/auth/login',
        });
      },
    };
  }
}

/**
 * Hook personalizado para usar en componentes React
 */
export const useAuth = () => {
  return AuthMiddleware.useAuthCheck();
};
