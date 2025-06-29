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

export interface UserMeDetail {
  id: string;
  email: string;
}
