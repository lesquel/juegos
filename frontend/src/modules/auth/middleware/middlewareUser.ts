import { useAuthStore } from "../store/auth.store";

export class MiddlewareUser {
  static isLogged() {
    if (!useAuthStore.getState().isLogged()) return false;
    return true;
  }
}
