export default defineNuxtRouteMiddleware(async (to, from) => {
  const config = useRuntimeConfig();
  if (config.public.sanctum.useAuthGlobal) {
    const { fetchUser, sanctumToken } = useSanctumAuth();

    if (sanctumToken.value) {
      await fetchUser();
    }
  }
});
