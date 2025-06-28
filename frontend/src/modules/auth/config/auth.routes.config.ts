export const authRoutesConfig = {
  base: {
    url: "/auth",
  },
  children: {
    login: {
      url: "/auth/login",
    },
    register: {
      url: "/auth/register",
    },
  },
};
