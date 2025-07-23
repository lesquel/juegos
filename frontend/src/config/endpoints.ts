export const endpoints = {
  appInfo: {
    get: "/app-info",
  },
  user: {
    get: "/users",
    getId: (id: string) => `/users/${id}`,
  },
  transferPayment: {
    get: (userId: string) => `/users/${userId}/transfers/`,
    getId: (id: string) => `/users/transfers/${id}`,
    post: `/users/transfers/`,
  },
  authentication: {
    login: "/auth/login",
    register: "/auth/register",
    me: "/auth/me",
  },
  categories: {
    get: "/categories",
    getId: (id: string) => `/categories/${id}`,
    getGamesByCategoryId: (id: string) => `/categories/${id}/games`,
  },
  games: {
    get: "/games",
    getId: (id: string) => `/games/${id}`,
    getCategoriesByGameId: (id: string) => `/games/${id}/categories`,
    reviews: {
      get: (id: string) => `/games/${id}/reviews`,
      post: (id: string) => `/games/${id}/reviews`,
      put: (reviewId: string) => `/games/reviews/${reviewId}`,
      delete: (reviewId: string) => `/games/reviews/${reviewId}`,
      getId: (id: string) => `/games/reviews/${id}`,
    },
  },
  matches: {
    getPartcipants: (id: string) => `/games/matches/${id}/participants`,
    joinMatch: (id: string) => `/games/matches/${id}/join`,
    finisMatch: (id: string) => `/games/matches/${id}/finish_match`,
    createMatch: (gameId: string) => `/games/${gameId}/matches`,
    getMatchesByGameId: (gameId: string) => `/games/${gameId}/matches`,
    getMathes: (id: string) => `/games/matches/${id}`,
  },
};
