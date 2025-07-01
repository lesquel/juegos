export interface UserMe {
  access_token: {
    access_token: string;
    token_type: string;
  };
  user: {
    user_id: string;
    username: string;
    email: string;
    role?: string;
  };
  message: string;
  success: true;
}

export interface UserMeDetail {
  message: string;
  data: {
    user_id: string;
    username: string;
    email: string;
    role?: string;
    virtual_currency: number;
    created_at: Date;
    updated_at: Date;
  };
  success: true;
}
