import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GameAdapter } from "../adapters/game.adapter";

export class GameClientData {
  private static readonly BASE_URL = "/data/";

  public static getGames() {
    return useQuery({
      queryKey: ["games"],
      queryFn: () =>
        axios.get(GameClientData.BASE_URL + "games.json").then((response) => {
          return GameAdapter.adaptList(response.data);
        }),
    });
  }

  public static getGameDetail(id: number) {
    return useQuery({
      queryKey: ["games", id],
      queryFn: () =>
        axios
          .get(`${GameClientData.BASE_URL}game${id}.json`)
          .then((response) => {
            return GameAdapter.adaptDetail(response.data);
          }),
    });
  }
}
