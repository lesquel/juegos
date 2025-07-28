import { redirect } from '@tanstack/react-router';
import { useAuthStore } from '../store/auth.store';
import { authRoutesConfig } from '../config/auth.routes.config';

export class AuthMiddleware {
  /**
   * Middleware para rutas que requieren autenticación
   * Redirige al login si el usuario no está autenticado
   */
  static requireAuth() {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') return;
    
    // Usar el store que sincroniza con cookies automáticamente
    const isAuthenticated = useAuthStore.getState().isLogged();
    
    if (!isAuthenticated) {
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
    
    // Usar el store que sincroniza con cookies automáticamente
    const isAuthenticated = useAuthStore.getState().isLogged();
    
    if (isAuthenticated) {
      throw redirect({
        to: '/',
      });
    }
  }

  /**
   * Utilidad para verificar estado de autenticación en componentes
   * No es un hook, es una función utilitaria
   */
  static getAuthStatus() {
    return {
      isAuthenticated: () => {
        if (typeof window === 'undefined') return false;
        return useAuthStore.getState().isLogged();
      },
      logout: () => {
        useAuthStore.getState().clearUser();
        // En lugar de redirect, usamos window.location para evitar problemas con hooks
        window.location.href = authRoutesConfig.children.login.url;
      },
    };
  }
}

/**
 * Hook personalizado para usar en componentes React
 * Este SÍ es un hook real que puede usar useEffect
 */
export const useAuth = () => {
  const store = useAuthStore();
  
  const isAuthenticated = () => {
    if (typeof window === 'undefined') return false;
    return store.isLogged();
  };

  const logout = () => {
    store.clearUser();
    window.location.href = authRoutesConfig.children.login.url;
  };

  const syncWithCookies = () => {
    store.syncWithCookies();
  };

  return {
    isAuthenticated,
    logout,
    syncWithCookies,
    user: store.user,
  };
};
