import { environment } from './environment'

export const endpoints = {
  // App info
  appInfo: {
    get: `${environment.API_URL}/app-info`,
  },
  
  // Auth endpoints
  auth: {
    login: `${environment.API_URL}/auth/login`,
    register: `${environment.API_URL}/auth/register`,
    logout: `${environment.API_URL}/auth/logout`,
    me: `${environment.API_URL}/auth/me`,
  },
  
  // User endpoints
  user: {
    get: `${environment.API_URL}/users`,
    getId: (id: string) => `${environment.API_URL}/users/${id}`,
    me: `${environment.API_URL}/users/me`,
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
