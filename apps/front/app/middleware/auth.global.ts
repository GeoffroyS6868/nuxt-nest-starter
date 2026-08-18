import { getCookie } from "h3";
import { useUser } from "~/composables/state";
import { getProfile } from "~/composables/user";

const ACCESS_TOKEN_COOKIE = "access_token";

/**
 * Resolves session once per app load.
 * `undefined` = unknown, `null` = guest, `User` = authenticated.
 *
 * SSR skips the profile request when the httpOnly access_token cookie is absent.
 * Read the token with h3 `getCookie` (not `useCookie`) so Nuxt never tries to
 * re-serialize the httpOnly JWT into the payload / Set-Cookie.
 */
export default defineNuxtRouteMiddleware(async () => {
  const user = useUser();

  if (user.value !== undefined) {
    return;
  }

  if (import.meta.client) {
    user.value = await getProfile();
    return;
  }

  if (import.meta.server) {
    const event = useRequestEvent();
    const accessToken = event ? getCookie(event, ACCESS_TOKEN_COOKIE) : undefined;
    if (!accessToken) {
      user.value = null;
      return;
    }
  }

  user.value = await getProfile();
});
