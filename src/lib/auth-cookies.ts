/**
 * Helpers to sync the orgToken into a cookie so that Next.js middleware
 * can enforce authentication on the server before any client JS runs.
 *
 * The cookie is NOT httpOnly (needs to be set from client JS) but is
 * SameSite=Lax, Secure (in production), and path=/.
 */

const COOKIE_NAME = "orgToken";

/**
 * Set the orgToken cookie after a successful login.
 */
export function setAuthCookie(token: string): void {
  const isSecure = window.location.protocol === "https:";
  const flags = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    "path=/",
    "SameSite=Lax",
    ...(isSecure ? ["Secure"] : []),
  ];
  document.cookie = flags.join("; ");
}

/**
 * Remove the orgToken cookie on logout.
 */
export function clearAuthCookie(): void {
  document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
