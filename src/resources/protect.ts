import type { HttpClient } from "../client.js";
import { Job } from "../job.js";
import type { ProtectOptions, JobCreatedResponse } from "../types.js";

export class ProtectResource {
  constructor(private http: HttpClient) {}

  /**
   * Protect media with a curated preset level (standard or maximum).
   * Returns a `Job` handle for polling the async result.
   */
  async execute(opts: ProtectOptions): Promise<Job> {
    const res = await this.http.postOne<JobCreatedResponse>(
      "/api/v1/protect",
      opts,
    );
    return new Job(this.http, res);
  }
}
