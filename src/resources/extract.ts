import type { HttpClient } from "../client.js";
import { Job } from "../job.js";
import type { ExtractOptions, JobCreatedResponse } from "../types.js";

export class ExtractResource {
  constructor(private http: HttpClient) {}

  /**
   * Extract raw embedding vectors from media using one or more named algorithms.
   * Returns a `Job` handle for polling the async result.
   *
   * The job result contains: { embeddings, media_type, algorithms_applied, algorithms_failed }
   */
  async execute(opts: ExtractOptions): Promise<Job> {
    const res = await this.http.postOne<JobCreatedResponse>("/api/v1/embed", opts);
    return new Job(this.http, res);
  }
}
