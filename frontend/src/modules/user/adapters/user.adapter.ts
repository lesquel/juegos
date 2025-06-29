import type { UserMe, UserMeDetail } from "../models/user.model";

export class UserAdapter {
  static adaptMe(user: any): UserMe {
    return {
      access_token: {
        access_token: user.access_token.access_token,
        token_type: user.access_token.token_type,
      },
      user: {
        id: user.user._id,
        email: user.user.email,
      },
    };
  }

  static adaptMeDetail(user: any): UserMeDetail {
    return {
      id: user._id,
      email: user.email,
    };
  }
}
