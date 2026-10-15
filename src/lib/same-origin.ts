import "server-only";
import { site } from "./config";

// Ochrana proti požadavkům z cizích webů (CSRF).

export const isJson = (request: Request) =>
  (request.headers.get("content-type") || "").toLowerCase().startsWith("application/json");

export const isForm = (request: Request) => {
  const type = (request.headers.get("content-type") || "").toLowerCase();
  return type.startsWith("application/x-www-form-urlencoded") || type.startsWith("multipart/form-data");
};

function allowedHosts(request: Request) {
  const hosts = new Set([new URL(site.url).host, new URL(request.url).host]);
  for (const h of [request.headers.get("host"), request.headers.get("x-forwarded-host")]) {
    if (h) hosts.add(h.split(",")[0].trim());
  }
  return hosts;
}

// Origin i Sec-Fetch-Site musí (když jsou) ukazovat na tenhle web.
// Bez Origin projde jen JSON: cizí formulář ho poslat neumí a fetch z cizího webu zastaví CORS.
export function isSameOrigin(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin") return false;
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      return allowedHosts(request).has(new URL(origin).host);
    } catch {
      return false;
    }
  }
  return isJson(request);
}
