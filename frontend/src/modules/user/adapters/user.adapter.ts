import type { UserMe, UserModel } from "../models/user.model";

export class UserAdapter {
  static adapt(user: any): UserModel {
    return {
      id: user.id,
      email: user.email,
    };
  }
  static adaptMe(user: any): UserMe {
    return {
      access_token: {
        access_token: user.access_token.access_token,
        token_type: user.access_token.token_type,
      },
      user: {
        id: user.user.id,
        email: user.user.email,
      },
    };
  }

  static adaptList(users: any): UserModel[] {
    return users.map((user: any) => this.adapt(user));
  }
}
