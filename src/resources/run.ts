import type { HttpClient } from "../client.js";
import { Job } from "../job.js";
import type { RunOptions, JobCreatedResponse } from "../types.js";

export class RunResource {
  constructor(private http: HttpClient) {}

  /**
   * Run one or more named algorithms on media.
   * Returns a `Job` handle for polling the async result.
   */
  async execute(opts: RunOptions): Promise<Job> {
    const res = await this.http.post<JobCreatedResponse>("/api/v1/run", opts);
    return new Job(this.http, res);
  }
}
