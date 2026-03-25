import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = [
  "/",
  "/auth/signin",
  "/auth/signup",
  "/auth/create-org",
  "/auth/forgot-pwd",
  "/auth/reset-password",
  "/acceptInvite",
  "/pricing",
  "/modules",
  "/testimonials",
  "/landingpage1",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes, static assets, and API routes
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    route === "/" ? pathname === "/" : pathname.startsWith(route)
  );
  const isStaticOrApi =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".");

  if (isPublicRoute || isStaticOrApi) {
    return NextResponse.next();
  }

  // Session is stored in localStorage (orgToken, auth-storage) and enforced in client layouts.
  // The API may set httpOnly cookies on the API host; those are not sent to this Next.js origin
  // when the frontend runs on another port, and the backend uses _fxl_1A2B3C / _fxl_9X8Y7Z,
  // not "token". Redirecting here when "token" is missing broke post-login navigation.
  const legacyToken = request.cookies.get("token")?.value;
  if (legacyToken) {
    try {
      const parts = legacyToken.split(".");
      if (parts.length === 3) {
        const payload = JSON.parse(
          Buffer.from(parts[1], "base64").toString("utf-8")
        );
        if (payload.exp && Date.now() >= payload.exp * 1000) {
          const signinUrl = new URL("/auth/signin", request.url);
          signinUrl.searchParams.set("redirect", pathname);
          signinUrl.searchParams.set("reason", "session_expired");
          const response = NextResponse.redirect(signinUrl);
          response.cookies.delete("token");
          return response;
        }
      }
    } catch {
      // ignore invalid legacy token shape
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
