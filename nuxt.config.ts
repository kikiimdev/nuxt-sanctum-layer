// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },

  runtimeConfig: {
    public: {
      sanctum: {
        baseURL: process.env.NUXT_SANCTUM_BASE_URL || "http://localhost:8000",
        endpoint: {
          fetchUser: "/api/user",
          login: "/api/login",
          logout: "/api/logout",
          csrf: "/sanctum/csrf-cookie",
        },
        loginUrl: "/auth",
        postLoginRedirectUrl: "/app",
        logoutRedirectUrl: "/auth",
      },
    },
  },
});
