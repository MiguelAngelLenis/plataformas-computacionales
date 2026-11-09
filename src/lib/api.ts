/**
 * apiClient — capa base para hablar con el backend NestJS
 * Usa fetch nativo, sin librerías raras. Didáctico y tipado.
 * Env: NEXT_PUBLIC_API_URL (http://localhost:3000 por defecto)
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export class ApiError extends Error {
  public status: number;
  public data: unknown;
  constructor(status: number, data: unknown) {
    const msg =
      typeof data === "object" && data !== null && "message" in data
        ? Array.isArray((data as { message: unknown }).message)
          ? ((data as { message: string[] }).message).join(", ")
          : String((data as { message: unknown }).message)
        : `Error ${status}`;
    super(msg);
    this.status = status;
    this.data = data;
  }
}

type Params = Record<string, string | number | undefined>;

function buildUrl(path: string, params?: Params) {
  const url = new URL(`${API_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

export const apiClient = {
  async get<T>(path: string, params?: Params): Promise<T> {
    const res = await fetch(buildUrl(path, params), { cache: "no-store" });
    if (!res.ok) throw new ApiError(res.status, await res.json().catch(() => ({ message: res.statusText })));
    return res.json();
  },
  async post<T>(path: string, data: unknown): Promise<T> {
    const res = await fetch(buildUrl(path), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new ApiError(res.status, await res.json().catch(() => ({ message: res.statusText })));
    return res.json();
  },
  async put<T>(path: string, data: unknown): Promise<T> {
    const res = await fetch(buildUrl(path), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new ApiError(res.status, await res.json().catch(() => ({ message: res.statusText })));
    return res.json();
  },
  async patch<T>(path: string, data: unknown): Promise<T> {
    const res = await fetch(buildUrl(path), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new ApiError(res.status, await res.json().catch(() => ({ message: res.statusText })));
    return res.json();
  },
  async delete<T>(path: string): Promise<T> {
    const res = await fetch(buildUrl(path), { method: "DELETE" });
    if (!res.ok) throw new ApiError(res.status, await res.json().catch(() => ({ message: res.statusText })));
    return res.json().catch(() => undefined as T);
  },
};

export { API_URL };
