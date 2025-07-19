import { environment } from "@config/environment";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { CommentGameCreate } from "../models/comment-game.model";
import { ErrorResponseAdapter } from "@adapters/errorResponse.adapter";
import type { ErrorResponseErrorsArray } from "@models/errorResponse";
import { useAuthStore } from "@modules/auth/store/auth.store";
import { endpoints } from "@config/endpoints";

export class CommentGameDataClient {
  private static readonly BASE_URL = environment.BASE_URL;
  static getCommentGames(gameId: string, hazMounted: boolean) {
    return useQuery({
      queryKey: ["comment-games", gameId, hazMounted],
      queryFn: () =>
        axios
          .get(
            `${CommentGameDataClient.BASE_URL}${endpoints.games.reviews.get(
              gameId
            )}`
          )
          .then((response) => {
            return response.data;
          }),
    });
  }

  static createCommentGame(
    gameId: string,
    hazMounted: boolean,
    setHasMounted: any
  ) {
    return useMutation({
      mutationFn: async (data: CommentGameCreate) => {
        try {
          const response = await axios.post(
            `${CommentGameDataClient.BASE_URL}${endpoints.games.reviews.post(
              gameId
            )}`,
            { ...data, rating: 1 },
            {
              headers: {
                Authorization: `Bearer ${
                  useAuthStore.getState().user?.access_token.access_token
                }`,
              },
            }
          );
          return response.data;
        } catch (error: any) {
          throw ErrorResponseAdapter.adaptErrorResponseErrorsArray(
            ErrorResponseAdapter.adaptErrorResponse(error)
          );
        }
      },
      onSuccess: (data) => {
        setHasMounted(true);
        console.log("Comentario creado", data);
      },
      onError: (error: ErrorResponseErrorsArray) => {
        console.error("onError:", error);
      },
    });
  }
}
