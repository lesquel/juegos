import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GameAdapter } from "../adapters/game.adapter";

export class GameClientData {
  private static readonly BASE_URL = "/data/games.json";

  public static getGames() {
    return useQuery({
      queryKey: ["games"],
      queryFn: () =>
        axios.get(GameClientData.BASE_URL).then((response) => {
          return GameAdapter.adaptList(response.data);
        }),
    });
  }

  public static getGameById(id: number) {
    return useQuery({
      queryKey: ["games", id],
      queryFn: () =>
        axios.get(`${GameClientData.BASE_URL}/${id}`).then((response) => {
          return response.data;
        }),
    });
  }
}
