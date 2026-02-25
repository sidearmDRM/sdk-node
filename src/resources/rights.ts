import type { HttpClient } from "../client.js";
import type { Rights } from "../types.js";

export class RightsResource {
  constructor(private http: HttpClient) {}

  /** Get C2PA, IPTC, and licensing information for a media asset. */
  async get(mediaId: string): Promise<Rights> {
    return this.http.get<Rights>(
      `/api/v1/rights/${encodeURIComponent(mediaId)}`,
    );
  }
}
