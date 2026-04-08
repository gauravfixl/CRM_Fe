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

  // Build response, forwarding all headers including Set-Cookie
  const resHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    // Forward every header – especially Set-Cookie
    resHeaders.append(key, value);
  });

  // fetch() auto-decompresses gzip/br, so these headers are now stale.
  // If forwarded, the browser will try to decompress an already-plain body
  // → ERR_CONTENT_DECODING_FAILED
  resHeaders.delete("transfer-encoding");
  resHeaders.delete("content-encoding");
  resHeaders.delete("content-length"); // length changed after decompression

  return new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: resHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const DELETE = proxy;
export const PATCH = proxy;
export const OPTIONS = proxy;
