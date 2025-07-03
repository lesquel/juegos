export interface LoginModel {
  email: string;
  password: string;
}

export interface RegiterInpustModel {
  email: string;
  password: string;
}

export interface RegisterModel {
  message: string;
  data: {
    user_id: string;
    username: string;
    email: string;
    role?: string;
  };
  success: true;
}
