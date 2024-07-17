export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user } = useSanctumAuth();
  const config = useRuntimeConfig();

  if (!user.value) {
    return navigateTo(config.public.sanctum.loginUrl);
  }
});
