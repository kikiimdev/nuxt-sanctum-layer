export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user } = useSanctumAuth();
  const config = useRuntimeConfig();

  if (!user.value) {
    return navigateTo({
      path: config.public.sanctum.loginUrl,
      query: { redirectTo: to.path },
    });
  }
});
