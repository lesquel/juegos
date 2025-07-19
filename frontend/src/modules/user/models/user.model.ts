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
  created_at: string; // formato ISO: "2025-07-15T21:32:36.560886Z"
  email: string;
  role: string;
  updated_at: string;
  user_id: string; // UUID
  virtual_currency: number;
}
