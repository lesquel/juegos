import type { UserMe } from "@modules/user/models/user.model";
import Cookies from "js-cookie";

export class CookiesSection {
  private static readonly cookieName = "user";

  static set(user: UserMe) {
    Cookies.set(CookiesSection.cookieName, JSON.stringify(user), {
      expires: 2.5,
    });
    console.log(Cookies.get(CookiesSection.cookieName));
  }

  static get(): UserMe | null {
    const cookieValue = Cookies.get(CookiesSection.cookieName);
    if (!cookieValue) return null;

    try {
      return JSON.parse(cookieValue) as UserMe;
    } catch (error) {
      console.error("Error parsing cookie:", error);
      return null;
    }
  }

  static clear() {
    Cookies.remove(CookiesSection.cookieName);
  }
}
