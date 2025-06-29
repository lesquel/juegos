import { GlobalInfoAdapter } from "@adapters/globalInfo.adapter";
import axios from "axios";

export class GlobalClientData {
  public static getGlobalInfo() {
    return axios
      .get("http://localhost:4321/data/globalInfo.json")
      .then((response) => GlobalInfoAdapter.adapt(response.data));
  }
}
