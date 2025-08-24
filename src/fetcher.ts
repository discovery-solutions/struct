export type FetcherOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  params?: Record<string, any>;
  body?: any;
  baseUrl?: string;
};

export async function fetcher<T = any>(
  url: string,
  {
    method = "GET",
    headers = {},
    params,
    body,
    baseUrl = "",
  }: FetcherOptions = {}
): Promise<T> {
  const query = params
    ? "?" + new URLSearchParams(params as Record<string, string>).toString()
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

  const data: any = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    if (Array.isArray(data?.error)) {
      const err = data?.error.reduce((acc: any, curr: any) => {
        acc[curr.path.at(0)] = curr.code;
        return acc;
      }, {});
      throw new Error(JSON.stringify(err));
    }

    throw new Error(
      data?.message || data?.error || `Request failed with status ${res.status}`
    );
  }

  return data;
}
