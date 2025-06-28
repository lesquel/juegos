import { environment } from "@config/environment";
import type { LoginModel } from "../models/auth.model";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { UserMe } from "@modules/user/models/user.model";
import { UserAdapter } from "@modules/user/adapters/user.adapter";
import { CookiesSection } from "../utils/cookiesSection";
import { useAuthStore } from "../store/auth.store";

export class AuthClientData {
  private static readonly baseUrl = environment.BASE_URL;
  static login() {
    const setUser = useAuthStore.getState().setUser;
    return useMutation({
      mutationFn: async (data: LoginModel) => {
        const response = await axios.post<UserMe>(
          `http://localhost:8000/auth/login`,
          data
        );
        return UserAdapter.adaptMe(response.data);
      },
      onSuccess: (data) => {
        CookiesSection.set(data);
        setUser(data);
        return data;
      },
      onError: (error) => {
        console.log(error);
      },
    });
  }
}
