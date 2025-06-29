import { environment } from "@config/environment";
import type { RegisterModel } from "../models/auth.model";

export class AuthAdapter {
  static adaptRegister(user: any): RegisterModel {
    return {
      id: user._id,
      email: user.email,
    };
  }
}
