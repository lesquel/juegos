import { environment } from "@config/environment";
import { useAuthStore } from "@modules/auth/store/auth.store";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { UserAdapter } from "../adapters/user.adapter";

export class UserClientData {
  private static readonly baseUrl = environment.BASE_URL;
  static getmMe() {
    const user = useAuthStore.getState().user;
    console.log(
      `${UserClientData.baseUrl}/auth/me?token=${user?.access_token.access_token}`
    );
    return useQuery({
      queryKey: ["userMe"],
      queryFn: () => {
        return axios
          .get(
            `${UserClientData.baseUrl}/auth/me?token=${user?.access_token.access_token}`
          )
          .then((response) => {
            console.log(response.data);
            return UserAdapter.adaptMeDetail(response.data);
          });
      },
    });
  }
}
