import { CookiesSection } from "../utils/cookiesSection";

export class MiddlewareUser {
  static isLogged() {
    return !!CookiesSection.get();
  }
}
