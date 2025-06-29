import { authRoutesConfig } from "../config/auth.routes.config";
import { useAuthStore } from "../store/auth.store";

export class MiddlewareAstroProtectUser {
  static isLogged() {
    if (!useAuthStore.getState().isLogged()) return;
    window.location.href = "/";
  }
  static isNotLogged() {
    if (useAuthStore.getState().isLogged()) return;
    window.location.href = authRoutesConfig.children.login.url;
  }
}
