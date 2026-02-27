import type { SidearmConfig } from "./types.js";

const DEFAULT_BASE_URL = "https://api.sdrm.io";

export class SidearmError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = "SidearmError";
  }
}

export class HttpClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(config: SidearmConfig) {
    if (!config.apiKey) {
      throw new Error(
        "apiKey is required. Get yours at https://sdrm.io/api-keys",
      );
    }
    this.apiKey = config.apiKey;
    this.baseUrl = (config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");
  }

  async get<T = unknown>(
    path: string,
    params?: Record<string, string | number | undefined>,
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null) {
          url.searchParams.set(k, String(v));
        }
      }
    }
    return this.request<T>(url, { method: "GET" });
  }

  async post<T = unknown>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(new URL(`${this.baseUrl}${path}`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T = unknown>(path: string, body: unknown): Promise<T> {
    return this.request<T>(new URL(`${this.baseUrl}${path}`), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  async delete<T = unknown>(path: string): Promise<T> {
    return this.request<T>(new URL(`${this.baseUrl}${path}`), {
      method: "DELETE",
    });
  }

  // ── Envelope-unwrapping helpers ────────────────────────────────────────────
  // All API responses are wrapped in { data: ... }. These helpers unwrap them.

  async getOne<T = unknown>(
    path: string,
    params?: Record<string, string | number | undefined>,
  ): Promise<T> {
    const res = await this.get<{ data: T }>(path, params);
    return res.data;
  }

  async getList<T = unknown>(
    path: string,
    params?: Record<string, string | number | undefined>,
  ): Promise<{ data: T[]; cursor?: string | null }> {
    const res = await this.get<{ data: T[]; meta?: { next_cursor?: string | null } }>(path, params);
    return { data: res.data, cursor: res.meta?.next_cursor };
  }

  async postOne<T = unknown>(path: string, body?: unknown): Promise<T> {
    const res = await this.post<{ data: T }>(path, body);
    return res.data;
  }

  async patchOne<T = unknown>(path: string, body: unknown): Promise<T> {
    const res = await this.patch<{ data: T }>(path, body);
    return res.data;
  }

  async deleteOne<T = unknown>(path: string): Promise<T> {
    const res = await this.delete<{ data: T }>(path);
    return res.data;
  }

  private async request<T>(url: URL, init: RequestInit): Promise<T> {
    const res = await fetch(url, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        Accept: "application/json",
        ...(init.headers as Record<string, string>),
      },
    });

    const text = await res.text();
    let json: unknown;
    try {
      json = JSON.parse(text);
    } catch {
      if (!res.ok) {
        throw new SidearmError(`HTTP ${res.status}: ${text}`, res.status);
      }
      return text as T;
    }

    if (!res.ok) {
      const msg =
        (json as Record<string, string>)?.message ??
        (json as Record<string, string>)?.error ??
        text;
      throw new SidearmError(msg, res.status, json);
    }

    return json as T;
  }
}
