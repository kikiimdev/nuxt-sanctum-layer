export const useSanctumAuth = () => {
  const config = useRuntimeConfig();
  const { $sanctumApi } = useNuxtApp();
  const user = useSanctumUser();
  const sanctumToken = useSanctumToken();
  const xsrfToken = useXsrfToken();

  type LoginBody = {
    username: string;
    password: string;
    [key: string]: any;
  };

  const login = async (
    body: LoginBody,
    { redirect }: { redirect: boolean } = { redirect: false }
  ) => {
    try {
      if (!xsrfToken.value) await fetchSanctumToken();

      const result: { token: string } = await $sanctumApi(
        config.public.sanctum.endpoint.login,
        {
          method: "POST",
          body: {
            ...body,
          },
        }
      );

      sanctumToken.value = result.token;

      await fetchUser();

      if (redirect) navigateTo(config.public.sanctum.postLoginRedirectUrl);
    } catch (e) {
      throw e;
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
      throw e;
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
      throw e;
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
      throw e;
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
