export const homeRoutesConfig = {
  base: "/home",
  children: {
    login: {
      url: "/auth/login",
    },
    register: {
      url: "/auth/register",
    },
  },
};