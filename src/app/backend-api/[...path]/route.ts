import { NextRequest, NextResponse } from "next/server";

// Allow larger request bodies (file uploads etc.)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const fetchCache = "default-no-store";

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api").replace(/\/$/, "");

// Headers that should NOT be forwarded to the backend
const SKIP_REQUEST_HEADERS = new Set([
  "host",
  "connection",
  "content-length", // recalculated by fetch
]);

async function proxy(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const targetPath = params.path.join("/");
  const search = req.nextUrl.search; // preserve query string
  const url = `${BACKEND_URL}/${targetPath}${search}`;

  // Build headers to forward
  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (!SKIP_REQUEST_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  // --- Robust Header-to-Cookie Bridging ---
  // If the frontend sent a token in headers, ensure it's also in the cookies.
  // This is critical because the backend middleware specifically looks for the '_fxl_1A2B3C' cookie.
  let tokenHeader = req.headers.get("org-token") || req.headers.get("token") || "";
  
  // Also check Authorization header
  if (!tokenHeader) {
    const authHeader = req.headers.get("authorization") || "";
    if (authHeader.startsWith("Bearer ")) {
      tokenHeader = authHeader.substring(7);
    }
  }

  const currentCookie = req.headers.get("cookie") || "";

  if (tokenHeader && !currentCookie.includes("_fxl_1A2B3C")) {
    const fxlCookie = `_fxl_1A2B3C=${tokenHeader}`;
    const newCookie = currentCookie ? `${currentCookie}; ${fxlCookie}` : fxlCookie;
    headers.set("cookie", newCookie);
  }

  // Ensure the backend sees the real client IP for fingerprint matching
  const clientIp =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    req.ip ||
    "";
  if (clientIp) {
    headers.set("x-forwarded-for", clientIp.split(",")[0].trim());
  }

  // Build fetch options
  const init: RequestInit = {
    method: req.method,
    headers,
    redirect: "manual",
  };

  // Attach body for non-GET/HEAD requests
  if (req.method !== "GET" && req.method !== "HEAD") {
    const ct = req.headers.get("content-type") || "";
    if (ct.includes("multipart/form-data")) {
      // For file uploads, forward the raw body
      init.body = await req.arrayBuffer();
    } else {
      init.body = await req.text();
    }
  }

  // Make the proxied request
  const upstream = await fetch(url, init);

  // Build response headers, forwarding everything EXCEPT set-cookie
  // (set-cookie needs special handling — see below)
  const resHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") return;
    resHeaders.append(key, value);
  });

  // fetch() auto-decompresses gzip/br, so these headers are now stale.
  // If forwarded, the browser will try to decompress an already-plain body
  // → ERR_CONTENT_DECODING_FAILED
  resHeaders.delete("transfer-encoding");
  resHeaders.delete("content-encoding");
  resHeaders.delete("content-length"); // length changed after decompression

  // --- Set-Cookie forwarding (critical) ---
  // Node's fetch combines multiple Set-Cookie headers into one comma-joined
  // string when iterated normally. Use getSetCookie() to get them as an array,
  // then rewrite each one to work on the vercel.app origin:
  //   - strip Domain=... (backend may set it to its own domain)
  //   - force Path=/
  //   - keep SameSite=None; Secure (required for same-origin HTTPS usage)
  const setCookies =
    typeof (upstream.headers as any).getSetCookie === "function"
      ? (upstream.headers as any).getSetCookie()
      : [];

  for (const cookieStr of setCookies) {
    const rewritten = rewriteSetCookie(cookieStr);
    resHeaders.append("set-cookie", rewritten);
  }

  return new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: resHeaders,
  });
}

/**
 * Rewrite a Set-Cookie value so the browser will accept it on the frontend origin.
 * - Removes any Domain=... attribute (backend's domain won't match vercel.app)
 * - Ensures Path=/
 * - Ensures SameSite=None; Secure (needed because the backend marks cookies HttpOnly
 *   and our frontend runs on HTTPS)
 */
function rewriteSetCookie(cookieStr: string): string {
  const parts = cookieStr.split(";").map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return cookieStr;

  const [nameValue, ...attrs] = parts;
  const kept: string[] = [];
  let hasPath = false;
  let hasSameSite = false;
  let hasSecure = false;

  for (const attr of attrs) {
    const lower = attr.toLowerCase();
    if (lower.startsWith("domain=")) continue; // drop domain
    if (lower.startsWith("path=")) {
      hasPath = true;
      kept.push("Path=/");
      continue;
    }
    if (lower.startsWith("samesite=")) {
      hasSameSite = true;
      kept.push("SameSite=None");
      continue;
    }
    if (lower === "secure") {
      hasSecure = true;
      kept.push("Secure");
      continue;
    }
    kept.push(attr);
  }

  if (!hasPath) kept.push("Path=/");
  if (!hasSameSite) kept.push("SameSite=None");
  if (!hasSecure) kept.push("Secure");

  return [nameValue, ...kept].join("; ");
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const DELETE = proxy;
export const PATCH = proxy;
export const OPTIONS = proxy;
