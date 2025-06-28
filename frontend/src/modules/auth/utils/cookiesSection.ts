
import type { UserMe } from "@modules/user/models/user.model";
import Cookies from "js-cookie";

export class CookiesSection {
  private static readonly cookieName = "user";

  static set(user: UserMe) {
    Cookies.set(CookiesSection.cookieName, JSON.stringify(user), {
      expires: 999999,
    });
    console.log(Cookies.get(CookiesSection.cookieName));
  }

  static get(): UserMe | null {
    return JSON.parse(Cookies.get(CookiesSection.cookieName) || "") || null;
  }

  static clear() {
    Cookies.remove(CookiesSection.cookieName);
  }
}
