import { authRoutesConfig } from "../config/auth.routes.config";
import { CookiesSection } from "../utils/cookiesSection";

export class MiddlewareAstroProtectUser {
  static isLogged() {
    // Solo ejecutar en el cliente, no en el servidor
    if (typeof window === 'undefined') return;
    
    // Si NO hay sesión, redirige al login
    if (!CookiesSection.get()) {
      window.location.href = authRoutesConfig.children.login.url;
    }
  }
  
  static isNotLogged() {
    // Solo ejecutar en el cliente, no en el servidor
    if (typeof window === 'undefined') return;
    
    // Si SÍ hay sesión, redirige al home
    if (CookiesSection.get()) {
      window.location.href = "/";
    }
  }
}
