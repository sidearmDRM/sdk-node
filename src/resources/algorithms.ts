import type { HttpClient } from "../client.js";
import type { Algorithm, ListAlgorithmsOptions } from "../types.js";

export class AlgorithmsResource {
  constructor(private http: HttpClient) {}

  /** List available algorithms, optionally filtered by category or media type. */
  async list(opts?: ListAlgorithmsOptions): Promise<Algorithm[]> {
    return this.http.getOne<Algorithm[]>("/api/v1/algorithms", {
      category: opts?.category,
      media_type: opts?.media_type,
    });
  }
}
