export default defineNuxtRouteMiddleware(async (to, from) => {
  const { fetchUser, sanctumToken } = useSanctumAuth();

  if (sanctumToken.value) {
    await fetchUser();
  }
});
