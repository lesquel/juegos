import { GlobalInfoAdapter } from "@adapters/globalInfo.adapter";
import { endpoints } from "@config/endpoints";
import type { GlobalInfo } from "@models/globalInfo";
import axios from "axios";

export class GlobalClientData {
  private static readonly baseUrl =
    endpoints.appInfo.get;
  public static getGlobalInfo() {
    return axios
      .get<GlobalInfo>(GlobalClientData.baseUrl)
      .then((response) => GlobalInfoAdapter.adapt(response.data));
  }
}
