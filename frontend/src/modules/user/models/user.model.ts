export interface UserMe {
  access_token: {
    access_token: string;
    token_type: string;
  };
  user: {
    id: string;
    email: string;
  };
}

export interface UserRegister {
  id: string;
  email: string;
}

export interface UserModel extends UserRegister {}
