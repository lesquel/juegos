import { environment } from "@config/environment";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { CommentGameCreate } from "../models/comment-game.model";
import { ErrorResponseAdapter } from "@adapters/errorResponse.adapter";
import type { ErrorResponseErrorsArray } from "@models/errorResponse";
import { useAuthStore } from "@modules/auth/store/auth.store";
import { endpoints } from "@config/endpoints";
import { useHasMountedComment } from "../store/hasMountedComment";

export class CommentGameDataClient {
  private static readonly BASE_URL = environment.BASE_URL;

  static getCommentGames(gameId: string) {
    const hasMounted = useHasMountedComment().hasMounted;
    return useQuery({
      queryKey: ["comment-games", gameId, hasMounted],
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      gcTime: 1000 * 60 * 10,
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
    onSuccess?: (data: CommentGameCreate) => void
  ) {
    const hasMounted = useHasMountedComment().hasMounted;
    const setHasMounted = useHasMountedComment().setHasMounted;
    return useMutation({
      mutationFn: async (data: CommentGameCreate) => {
        try {
          const response = await axios.post(
            `${CommentGameDataClient.BASE_URL}${endpoints.games.reviews.post(
              gameId
            )}`,
            data,
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
        onSuccess?.(data);
        setHasMounted(!hasMounted);
      },
      onError: (error: ErrorResponseErrorsArray) => {
        console.error("onError:", error);
      },
    });
  }

  static deleteCommentGame(commentId: string) {
    const hasMounted = useHasMountedComment().hasMounted;
    const setHasMounted = useHasMountedComment().setHasMounted;
    return useMutation({
      mutationFn: async () => {
        try {
          const response = await axios.delete(
            `${CommentGameDataClient.BASE_URL}${endpoints.games.reviews.delete(
              commentId
            )}`,
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
        setHasMounted(!hasMounted);
        console.log("Comentario eliminado", data);
      },
      onError: (error: ErrorResponseErrorsArray) => {
        console.error("onError:", error);
      },
    });
  }

  static editCommentGame(commentId: string) {
    const hasMounted = useHasMountedComment().hasMounted;
    const setHasMounted = useHasMountedComment().setHasMounted;
    return useMutation({
      mutationFn: async (data: CommentGameCreate) => {
        try {
          const response = await axios.put(
            `${CommentGameDataClient.BASE_URL}${endpoints.games.reviews.put(
              commentId
            )}`,
            data,
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
        setHasMounted(!hasMounted);
        console.log("Comentario editado", data);
      },
      onError: (error: ErrorResponseErrorsArray) => {
        console.error("onError:", error);
      },
    });
  }
}
