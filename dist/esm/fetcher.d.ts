export type FetcherOptions = {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    headers?: Record<string, string>;
    params?: Record<string, any>;
    body?: any;
    baseUrl?: string;
};
export declare function fetcher<T = any>(url: string, { method, headers, params, body, baseUrl, }?: FetcherOptions): Promise<T>;
