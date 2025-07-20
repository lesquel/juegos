import { environment } from "@config/environment";
import { useAuthStore } from "@modules/auth/store/auth.store";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { UserAdapter } from "../adapters/user.adapter";
import { endpoints } from "@config/endpoints";

export class UserClientData {
  private static readonly baseUrl = environment.BASE_URL;
  static getmMe() {
    const user = useAuthStore.getState().user;
    return useQuery({
      queryKey: ["userMe"],
      queryFn: () => {
        return axios
          .get(`${UserClientData.baseUrl}${endpoints.authentication.me}`, {
            headers: {
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
      queryFn: () =>
        axios
          .get(`${UserClientData.baseUrl}${endpoints.user.getId(id)}`)
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
      queryFn: () => {
        return axios
          .get(`${UserClientData.baseUrl}${endpoints.authentication.me}`, {
            headers: {
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
