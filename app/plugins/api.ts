export default defineNuxtPlugin((app) => {
  const config = useRuntimeConfig();

  // const { $precognition } = useNuxtApp();
  // const token = useXsrfToken();
  // const sanctumToken = useSanctumToken();

  const api = $fetch.create({
    baseURL: config.public.sanctum.baseURL,
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    onRequest: ({ options }) => {
      const token = useXsrfToken();
      const sanctumToken = useSanctumToken();
      // Setup csrf protection for every requests if available
      const headers = new Headers(options.headers);

      if (token.value) headers.set("X-XSRF-TOKEN", token.value);
      else headers.delete("X-XSRF-TOKEN");

      if (sanctumToken.value)
        headers.set("Authorization", `Bearer ${sanctumToken.value}`);
      else headers.delete("Authorization");

      options.headers = headers;
    },
    onResponse: (context) => {
      // ensure that all precognitive requests will receive precognitive responses
      // $precognition.assertSuccessfulPrecognitiveResponses(context);
    },
  });

  async function fetchSanctumToken() {
    try {
      const token = useXsrfToken();
      await api(config.public.sanctum.endpoint.csrf);
      token.value = useCookie("XSRF-TOKEN").value;

      if (!token.value) {
        throw new Error("Failed to get CSRF token");
      }
    } catch (e) {
      console.error(e);
    }
  }

  app.hook("app:mounted", fetchSanctumToken);

  return {
    provide: {
      sanctumApi: api,
      sanctum: {
        fetchToken: fetchSanctumToken,
        token: useXsrfToken(),
      },
    },
  };
});
