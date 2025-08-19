"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cn = cn;
exports.fetcher = fetcher;
const clsx_1 = require("clsx");
const tailwind_merge_1 = require("tailwind-merge");
function cn(...inputs) {
    return (0, tailwind_merge_1.twMerge)((0, clsx_1.clsx)(inputs));
}
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
        if (Array.isArray(data?.error)) {
            const err = data?.error.reduce((acc, curr) => {
                acc[curr.path.at(0)] = curr.code;
                return acc;
            }, {});
            throw new Error(JSON.stringify(err));
        }
        throw new Error(data?.message || data?.error || `Request failed with status ${res.status}`);
    }
    return data;
}
