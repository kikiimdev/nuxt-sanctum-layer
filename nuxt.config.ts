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
        baseURL: "http://localhost:8000",
        endpoint: {
          fetchUser: "/api/user",
          login: "/api/login",
          logout: "/api/logout",
          csrf: "/sanctum/csrf-cookie",
        },
      },
    },
  },
});
