import { environment } from "@config/environment";
import { useAuthStore } from "@modules/auth/store/auth.store";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { UserAdapter } from "../adapters/user.adapter";
import { endpoints } from "@config/endpoints";

// Configuración optimizada para datos de usuario
const USER_QUERY_CONFIG = {
  gcTime: 1000 * 60 * 45, // 45 minutos en cache
  staleTime: 1000 * 60 * 20, // 20 minutos sin refetch
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
  retry: 2,
  retryDelay: 1500,
};

const USER_AXIOS_CONFIG = {
  timeout: 6000,
  headers: {
    'Content-Type': 'application/json',
  }
};

export class UserClientData {
  private static readonly baseUrl = environment.BASE_URL;
  static getmMe() {
    const user = useAuthStore.getState().user;
    return useQuery({
      queryKey: ["userMe"],
      ...USER_QUERY_CONFIG,
      queryFn: () => {
        return axios
          .get(`${UserClientData.baseUrl}${endpoints.authentication.me}`, {
            ...USER_AXIOS_CONFIG,
            headers: {
              ...USER_AXIOS_CONFIG.headers,
              Authorization: `Bearer ${user?.access_token.access_token}`,
            },
          })
          .then((response) => {
            console.log("data me", response.data);
            return UserAdapter.adaptMeDetail(response.data);
          });
      },
    });
  }

  static getUser(id: string) {
    return useQuery({
      queryKey: ["user", id],
      ...USER_QUERY_CONFIG,
      queryFn: () =>
        axios
          .get(`${UserClientData.baseUrl}${endpoints.user.getId(id)}`, {
            ...USER_AXIOS_CONFIG,
          })
          .then((response) => {
            console.log("data user aaaa", response.data);
            return UserAdapter.adaptMeDetail(response.data);
          }),
    });
  }

  static getMyVirtualCurrency() {
    const user = useAuthStore.getState().user;
    return useQuery({
      queryKey: ["userVirtualCurrency"],
      ...USER_QUERY_CONFIG,
      queryFn: () => {
        return axios
          .get(`${UserClientData.baseUrl}${endpoints.authentication.me}`, {
            ...USER_AXIOS_CONFIG,
            headers: {
              ...USER_AXIOS_CONFIG.headers,
              Authorization: `Bearer ${user?.access_token.access_token}`,
            },
          })
          .then((response) => {
            return UserAdapter.adaptVirtualCurrency(response.data);
          });
      },
    });
  }
}
