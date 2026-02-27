import type { HttpClient } from "../client.js";
import type {
  SearchOptions,
  SearchResponse,
  PaginationOptions,
  PaginatedResponse,
} from "../types.js";

export class SearchResource {
  constructor(private http: HttpClient) {}

  /** Run a similarity search. Returns results immediately. */
  async run(opts: SearchOptions): Promise<SearchResponse> {
    const { tags, limit, ...body } = opts;
    const payload: Record<string, unknown> = { ...body };
    if (tags) payload.scope = { tags };

    const qs = new URLSearchParams();
    if (limit) qs.set("limit", String(limit));
    const path = qs.toString() ? `/api/v1/search?${qs}` : "/api/v1/search";

    return this.http.postOne<SearchResponse>(path, payload);
  }

  /** List previous searches on your account. */
  async list(
    opts?: PaginationOptions,
  ): Promise<PaginatedResponse<Record<string, unknown>>> {
    return this.http.getList("/api/v1/search", {
      cursor: opts?.cursor,
      limit: opts?.limit,
    });
  }
}
