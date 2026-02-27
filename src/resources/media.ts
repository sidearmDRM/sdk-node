import type { HttpClient } from "../client.js";
import type {
  Media,
  RegisterMediaOptions,
  UpdateMediaOptions,
  PaginationOptions,
  PaginatedResponse,
  ProvenanceResult,
} from "../types.js";

export class MediaResource {
  constructor(private http: HttpClient) {}

  /** Register and index media. Optionally applies watermarks on ingest. */
  async register(opts: RegisterMediaOptions): Promise<Media> {
    return this.http.postOne<Media>("/api/v1/media", opts);
  }

  /** List media assets in your library (paginated). */
  async list(opts?: PaginationOptions): Promise<PaginatedResponse<Media>> {
    return this.http.getList<Media>("/api/v1/media", {
      cursor: opts?.cursor,
      limit: opts?.limit,
    });
  }

  /** Get a specific media asset by ID. */
  async get(id: string): Promise<Media> {
    return this.http.getOne<Media>(
      `/api/v1/media/${encodeURIComponent(id)}`,
    );
  }

  /** Update media metadata. */
  async update(id: string, opts: UpdateMediaOptions): Promise<Media> {
    return this.http.patchOne<Media>(
      `/api/v1/media/${encodeURIComponent(id)}`,
      opts,
    );
  }

  /** Permanently delete a media asset and all associated data. */
  async delete(id: string): Promise<{ deleted: boolean }> {
    return this.http.deleteOne(
      `/api/v1/media/${encodeURIComponent(id)}`,
    );
  }

  /**
   * Get the full provenance chain for a media asset.
   * Returns every algorithm applied, C2PA manifest, membership inference results,
   * and all searches where this media appeared as a match.
   */
  async provenance(id: string): Promise<ProvenanceResult> {
    return this.http.getOne<ProvenanceResult>(
      `/api/v1/media/${encodeURIComponent(id)}/provenance`,
    );
  }
}
