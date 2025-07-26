import { authRoutesConfig } from "../config/auth.routes.config";
import { CookiesSection } from "../utils/cookiesSection";

export class MiddlewareAstroProtectUser {
  static isLogged() {
    // Si NO hay sesión, redirige al login
    if (!CookiesSection.get()) {
      window.location.href = authRoutesConfig.children.login.url;
    }
  }
  static isNotLogged() {
    // Si SÍ hay sesión, redirige al home
    if (CookiesSection.get()) {
      window.location.href = "/";
    }
  }
}
