import { environment } from "@config/environment";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { CommentGameCreate } from "../models/comment-game.model";
import { ErrorResponseAdapter } from "@adapters/errorResponse.adapter";
import type { ErrorResponseErrorsArray } from "@models/errorResponse";
import { useAuthStore } from "@modules/auth/store/auth.store";
import { endpoints } from "@config/endpoints";
import { useHasMountedComment } from "../store/hasMountedComment";

const BASE_URL = environment.API_URL;

// Hook exports for proper React Query usage
export const useCommentGames = (gameId: string) => {
  const hasMounted = useHasMountedComment().hasMounted;
  return useQuery({
    queryKey: ["comment-games", gameId, hasMounted],
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    gcTime: 1000 * 60 * 10,
    queryFn: () =>
      axios
        .get(`${BASE_URL}${endpoints.games.reviews.get(gameId)}`)
        .then((response) => response.data),
  });
};

export const useCreateCommentGame = (
  gameId: string,
  onSuccess?: (data: CommentGameCreate) => void
) => {
  const hasMounted = useHasMountedComment().hasMounted;
  const setHasMounted = useHasMountedComment().setHasMounted;
  
  return useMutation({
    mutationFn: async (data: CommentGameCreate) => {
      try {
        const response = await axios.post(
          `${BASE_URL}${endpoints.games.reviews.post(gameId)}`,
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
};

export const useDeleteCommentGame = (commentId: string) => {
  const hasMounted = useHasMountedComment().hasMounted;
  const setHasMounted = useHasMountedComment().setHasMounted;
  
  return useMutation({
    mutationFn: async () => {
      try {
        const response = await axios.delete(
          `${BASE_URL}${endpoints.games.reviews.delete(commentId)}`,
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
};

export const useEditCommentGame = (commentId: string) => {
  const hasMounted = useHasMountedComment().hasMounted;
  const setHasMounted = useHasMountedComment().setHasMounted;
  
  return useMutation({
    mutationFn: async (data: CommentGameCreate) => {
      try {
        const response = await axios.put(
          `${BASE_URL}${endpoints.games.reviews.put(commentId)}`,
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
};

// Keep class for backward compatibility if needed
export class CommentGameDataClient {
  private static readonly BASE_URL = environment.API_URL;

  // Note: These static methods are deprecated - use the hook exports above
  static getCommentGames(_gameId: string) {
    console.warn('CommentGameDataClient.getCommentGames is deprecated. Use useCommentGames hook instead.');
    // Return a placeholder for backward compatibility
    return { data: null, isLoading: false, error: null };
  }

  static createCommentGame(_gameId: string, _onSuccess?: (data: CommentGameCreate) => void) {
    console.warn('CommentGameDataClient.createCommentGame is deprecated. Use useCreateCommentGame hook instead.');
    // Return a placeholder for backward compatibility
    return { mutate: () => {}, isLoading: false, error: null };
  }

  static deleteCommentGame(_commentId: string) {
    console.warn('CommentGameDataClient.deleteCommentGame is deprecated. Use useDeleteCommentGame hook instead.');
    // Return a placeholder for backward compatibility
    return { mutate: () => {}, isLoading: false, error: null };
  }

  static editCommentGame(_commentId: string) {
    console.warn('CommentGameDataClient.editCommentGame is deprecated. Use useEditCommentGame hook instead.');
    // Return a placeholder for backward compatibility
    return { mutate: () => {}, isLoading: false, error: null };
  }
}
