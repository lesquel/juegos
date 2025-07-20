import type {
  MyVirtualCurrency,
  UserMe,
  UserMeDetail,
} from "../models/user.model";

export class UserAdapter {
  static adaptMe(user: any): UserMe {
    return {
      message: user.message,
      access_token: {
        access_token: user.token.access_token,
        token_type: user.token.token_type,
      },
      user: {
        user_id: user.user.user_id,
        username: user.user.username,
        email: user.user.email,
        role: user.user.role,
      },
      success: user.success,
    };
  }

  static adaptMeDetail(user: any): UserMeDetail {
    return {
      created_at: user.created_at,
      email: user.email,
      role: user.role,
      updated_at: user.updated_at,
      user_id: user.user_id,
      virtual_currency: user.virtual_currency,
    };
  }

  static adaptVirtualCurrency(user: any): MyVirtualCurrency {
    return {
      virtual_currency: user.virtual_currency,
    };
  }
}
