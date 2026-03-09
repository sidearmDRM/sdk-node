import type { HttpClient } from "../client.js";
import type { CreateShareOptions, SharedResult } from "../types.js";

export class SharesResource {
  constructor(private http: HttpClient) {}

  /** Create a shareable link for a detection, search, or provenance result. */
  async create(opts: CreateShareOptions): Promise<SharedResult> {
    return this.http.postOne<SharedResult>("/api/v1/shares", opts);
  }

  /** Get a shared result by ID. */
  async get(id: string): Promise<SharedResult> {
    return this.http.getOne<SharedResult>(
      `/api/v1/shares/${encodeURIComponent(id)}`,
    );
  }

  /** Publish a shared result, making it publicly accessible. */
  async publish(id: string): Promise<SharedResult> {
    return this.http.patchOne<SharedResult>(
      `/api/v1/shares/${encodeURIComponent(id)}`,
      { is_public: true },
    );
  }
}
