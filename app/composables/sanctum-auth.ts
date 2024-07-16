export const useSanctumAuth = () => {
  const config = useRuntimeConfig();
  const { $sanctumApi } = useNuxtApp();
  const user = useSanctumUser();
  const sanctumToken = useSanctumToken();
  const xsrfToken = useXsrfToken();

  const login = async (body: { username: string; password: string }) => {
    try {
      if (!xsrfToken.value) await fetchSanctumToken();

      const result: { token: string } = await $sanctumApi(
        config.public.sanctum.endpoint.login,
        {
          method: "POST",
          body: {
            ...body,
            device_name: "browser",
          },
        }
      );

      sanctumToken.value = result.token;

      await fetchUser();
    } catch (e) {
      console.error(e);
    }
  };

  const logout = async () => {
    try {
      await $sanctumApi(config.public.sanctum.endpoint.logout, {
        method: "POST",
      });

      sanctumToken.value = null;
      user.value = null;
      xsrfToken.value = null;
    } catch (e) {
      console.error(e);
    }
  };

  const fetchUser = async () => {
    try {
      const result: any = await $sanctumApi(
        config.public.sanctum.endpoint.fetchUser
      );

      if (result) user.value = result;
      else user.value = null;
    } catch (e: any) {
      console.error(e);
    }
  };

  async function fetchSanctumToken() {
    try {
      await $sanctumApi(config.public.sanctum.endpoint.csrf);
      xsrfToken.value = useCookie("XSRF-TOKEN").value;

      if (!xsrfToken.value) {
        throw new Error("Failed to get CSRF token");
      }
    } catch (e) {
      console.error(e);
    }
  }

  return {
    user,
    login,
    logout,
    fetchUser,
    sanctumToken,
  };
};

const useSanctumUser = () => {
  const user = useState("sanctum-user", () => null);

  return user;
};

export const useSanctumToken = () => {
  const cookieToken = useCookie("sanctum-token");
  const token = useState("sanctum-token", () => cookieToken.value);

  watch(token, (value) => {
    cookieToken.value = value;
  });

  return token;
};

export const useXsrfToken = () => {
  const cookieToken = useCookie("xsrf-token");
  const token = useState("xsrf-token", () => cookieToken.value);

  watch(token, (value) => {
    cookieToken.value = value;
  });

  return token;
};
