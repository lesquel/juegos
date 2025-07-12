import { environment } from "@config/environment";
import type {
  LoginModel,
  RegisterModel,
  RegiterInpustModel,
} from "../models/auth.model";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { UserMe } from "@modules/user/models/user.model";
import { UserAdapter } from "@modules/user/adapters/user.adapter";
import { CookiesSection } from "../utils/cookiesSection";
import { useAuthStore } from "../store/auth.store";
import { authRoutesConfig } from "../config/auth.routes.config";
import { AuthAdapter } from "../adapters/auth.adapter";
import { ErrorResponseAdapter } from "@adapters/errorResponse.adapter";
import type {
  ErrorResponse,
  ErrorResponseErrorsArray,
} from "@models/errorResponse";

export class AuthClientData {
  private static readonly baseUrl = environment.BASE_URL;
  static login() {
    const setUser = useAuthStore.getState().setUser;
    return useMutation({
      mutationFn: async (data: LoginModel) => {
        try {
          const response = await axios.post<UserMe>(
            `${AuthClientData.baseUrl}/auth/login`,
            data
          );
          return UserAdapter.adaptMe(response.data);
        } catch (error: any) {
          throw ErrorResponseAdapter.adaptErrorResponseErrorsArray(
            ErrorResponseAdapter.adaptErrorResponse(error)
          );
        }
      },
      onSuccess: (data) => {
        CookiesSection.set(data);
        setUser(data);
        window.location.href = "/";
      },
      onError: (error: ErrorResponseErrorsArray) => {
        console.error("onError:", error);
      },
    });
  }

  static register() {
    return useMutation({
      mutationFn: async (data: RegiterInpustModel) => {
        try {
          const response = await axios.post<UserMe>(
            `${AuthClientData.baseUrl}/auth/register`,
            data
          );
          return response.data;
        } catch (error: any) {
          throw ErrorResponseAdapter.adaptErrorResponseErrorsArray(
            ErrorResponseAdapter.adaptErrorResponse(error)
          );
        }
      },
      onSuccess: (data) => {
        window.location.href = authRoutesConfig.children.login.url;
        return data;
      },
      onError: (error: ErrorResponseErrorsArray) => {
        console.log(error);
      },
    });
  }

  static logout() {
    if (useAuthStore.getState().isLogged()) {
      CookiesSection.clear();
      useAuthStore.getState().clearUser();
      window.location.href = "/";
    }
  }
}
