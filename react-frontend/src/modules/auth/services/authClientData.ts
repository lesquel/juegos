import { environment } from "@config/environment";
import type { LoginModel, RegiterInpustModel } from "../models/auth.model";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { UserMe } from "@modules/user/models/user.model";
import { UserAdapter } from "@modules/user/adapters/user.adapter";
import { CookiesSection } from "../utils/cookiesSection";
import { useAuthStore } from "../store/auth.store";
import { authRoutesConfig } from "../config/auth.routes.config";
import { ErrorResponseAdapter } from "@adapters/errorResponse.adapter";
import type { ErrorResponseErrorsArray } from "@models/errorResponse";
import { endpoints } from "@config/endpoints";

// Configuración optimizada para mutaciones de autenticación
const MUTATION_CONFIG = {
  retry: 2, // 2 reintentos para auth
  retryDelay: (attemptIndex: number) =>
    Math.min(1000 * 2 ** attemptIndex, 30000),
};

const AXIOS_CONFIG = {
  timeout: 8000, // 8 segundos para auth (más tiempo)
  headers: {
    "Content-Type": "application/json",
  },
};

const baseUrl = environment.API_URL;

export const useLoginMutation = () => {
  const setUser = useAuthStore.getState().setUser;
  return useMutation({
    ...MUTATION_CONFIG,
    mutationFn: async (data: LoginModel) => {
      try {
        const response = await axios.post(
          `${baseUrl}${endpoints.authentication.login}`,
          data,
          AXIOS_CONFIG
        );
        console.log(response.data);
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
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = "/";
      }
    },
    onError: (error: ErrorResponseErrorsArray) => {
      console.error("onError:", error);
    },
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    ...MUTATION_CONFIG,
    mutationFn: async (data: RegiterInpustModel) => {
      try {
        const response = await axios.post<UserMe>(
          `${baseUrl}${endpoints.authentication.register}`,
          data,
          AXIOS_CONFIG
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
};

export const logoutUser = () => {
  if (useAuthStore.getState().isLogged()) {
    CookiesSection.clear();
    useAuthStore.getState().clearUser();
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  }
};

export class AuthClientData {
  static login = useLoginMutation;
  static register = useRegisterMutation;
  static logout = logoutUser;
}
