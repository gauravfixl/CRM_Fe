import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = [
  "/",
  "/auth/signin",
  "/auth/signup",
  "/auth/create-org",
  "/auth/forgot-pwd",
  "/auth/reset-password",
  "/reset-password",
  "/accept-invite",
  "/pricing",
  "/modules",
  "/testimonials",
  "/landingpage1",
  "/landingpage2",
  "/landingpage2/pricing",
  "/explore",
  "/features",
  "/about",
  "/guided-tour",
  "/unauthorized",
  "/resources",
  "/support",
  "/pricing-overview",
  "/marketplace",
  "/products/enterprise",
  "/products/startups",
  "/products/agencies",
  "/products/healthcare",
  "/products/education",
  "/products/real-estate",
  "/products/retail",
  "/products/manufacturing",
  "/products/legal",
  "/products/non-profit",
  "/products/logistics",
  "/products/it-saas",
  "/products/consulting-firms",
  "/news",
  "/integrations",
  "/api-docs",
  "/system-status",
  "/blog",
  "/customer-stories",
  "/help-center",
  "/webinars",
  "/community",
  "/careers",
  "/contact",
  "/privacy-policy",
  "/terms-of-service",
  "/terms",
  "/privacy",
];

/**
 * Decode a JWT payload without verifying signature.
 * Returns null if the token is malformed.
 */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    return JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
  } catch {
    return null;
  }
}

/**
 * Check if a JWT token is expired based on its `exp` claim.
 */
function isTokenExpired(payload: Record<string, unknown>): boolean {
  const exp = payload.exp;
  if (typeof exp !== "number") return false; // no exp claim → not expired
  return Date.now() >= exp * 1000;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes, static assets, and API routes
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    route === "/" ? pathname === "/" : pathname.startsWith(route)
  );
  const isStaticOrApi =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/backend-api") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".");

  if (isPublicRoute || isStaticOrApi) {
    return NextResponse.next();
  }

  // --- Authentication enforcement ---
  // The orgToken cookie is set by the client on login and cleared on logout.
  // This is the primary server-side auth gate for all protected routes.
  const orgToken = request.cookies.get("orgToken")?.value;

  if (!orgToken) {
    // No auth token → show unauthorized error page
    const unauthorizedUrl = new URL("/unauthorized", request.url);
    unauthorizedUrl.searchParams.set("path", pathname);
    return NextResponse.redirect(unauthorizedUrl);
  }

  // Validate token structure - only redirect for invalid (malformed) tokens.
  // Expired tokens are handled client-side by the axios interceptor which
  // silently refreshes them via the /auth/refresh endpoint.
  const payload = decodeJwtPayload(orgToken);
  if (!payload) {
    const unauthorizedUrl = new URL("/unauthorized", request.url);
    unauthorizedUrl.searchParams.set("path", pathname);
    unauthorizedUrl.searchParams.set("reason", "invalid_session");
    const response = NextResponse.redirect(unauthorizedUrl);
    response.cookies.delete("orgToken");
    return response;
  }

  // --- Legacy "token" cookie cleanup ---
  const legacyToken = request.cookies.get("token")?.value;
  if (legacyToken) {
    const legacyPayload = decodeJwtPayload(legacyToken);
    if (legacyPayload && isTokenExpired(legacyPayload)) {
      const resp = NextResponse.next();
      resp.cookies.delete("token");
      return resp;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
