import type { UserMe, UserMeDetail } from "../models/user.model";

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
      message: user.message,
      data: {
        user_id: user.data.user_id,
        username: user.data.username,
        email: user.data.email,
        role: user.data.role,
        virtual_currency: user.data.virtual_currency,
        created_at: new Date(user.data.created_at),
        updated_at: new Date(user.data.updated_at),
      },
      success: user.success,
    };
  }
}
