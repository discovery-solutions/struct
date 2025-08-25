"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetcher = fetcher;
async function fetcher(url, { method = "GET", headers = {}, params, body, baseUrl = "", } = {}) {
    const query = params
        ? "?" + new URLSearchParams(params).toString()
        : "";
    const fullUrl = `${baseUrl}${url}${query}`;
    if (!(body instanceof FormData))
        headers["Content-Type"] = "application/json";
    const res = await fetch(fullUrl, {
        headers,
        method,
        cache: "no-store",
        body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    });
    const contentType = res.headers.get("Content-Type") || "";
    const isJson = contentType.includes("application/json");
    const data = isJson ? await res.json() : await res.text();
    if (!res.ok) {
        throw new Error(data?.message || data?.error || `Request failed with status ${res.status}`);
    }
    return data;
}
