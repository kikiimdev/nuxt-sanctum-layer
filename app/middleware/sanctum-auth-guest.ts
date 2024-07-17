export default defineNuxtRouteMiddleware(async (to, from) => {
  const config = useRuntimeConfig();
  const { user } = useSanctumAuth();

  if (user.value) {
    return navigateTo(
      from.query?.redirectTo?.toString() ||
        config.public.sanctum.postLoginRedirectUrl
    );
  }
});
