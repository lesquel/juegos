import { useAuthStore } from "../store/auth.store";

export class MiddlewareAstroProtectUser {
  static isLogged() {
    if (!useAuthStore.getState().isLogged()) return;
    window.location.href = "/";
  }
}
