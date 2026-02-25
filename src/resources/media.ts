import type { HttpClient } from "../client.js";
import type {
  Media,
  RegisterMediaOptions,
  UpdateMediaOptions,
  PaginationOptions,
  PaginatedResponse,
} from "../types.js";

export class MediaResource {
  constructor(private http: HttpClient) {}

  /** Register and index media. Optionally applies watermarks on ingest. */
  async register(opts: RegisterMediaOptions): Promise<Media> {
    return this.http.post<Media>("/api/v1/media", opts);
  }

  /** List media assets in your library (paginated). */
  async list(opts?: PaginationOptions): Promise<PaginatedResponse<Media>> {
    return this.http.get("/api/v1/media", {
      cursor: opts?.cursor,
      limit: opts?.limit,
    });
  }

  /** Get a specific media asset by ID. */
  async get(id: string): Promise<Media> {
    return this.http.get<Media>(
      `/api/v1/media/${encodeURIComponent(id)}`,
    );
  }

  /** Update media metadata. */
  async update(id: string, opts: UpdateMediaOptions): Promise<Media> {
    return this.http.patch<Media>(
      `/api/v1/media/${encodeURIComponent(id)}`,
      opts,
    );
  }

  /** Permanently delete a media asset and all associated data. */
  async delete(id: string): Promise<{ deleted: boolean }> {
    return this.http.delete(
      `/api/v1/media/${encodeURIComponent(id)}`,
    );
  }
}
