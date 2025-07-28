import type { RegisterModel } from "../models/auth.model";

export class AuthAdapter {
  static adaptRegister(user: any): RegisterModel {
    return {
      message: user.message,
      data: {
        user_id: user.data.user_id,
        username: user.data.username,
        email: user.data.email,
        role: user.data.role,
      },
      success: user.success,
    };
  }
}
