import type { HttpClient } from "../client.js";
import type { JobData } from "../types.js";
import { Job } from "../job.js";

export class JobsResource {
  constructor(private http: HttpClient) {}

  /** Get the current state of a job by ID. */
  async get(id: string): Promise<JobData> {
    return this.http.get<JobData>(
      `/api/v1/jobs/${encodeURIComponent(id)}`,
    );
  }

  /**
   * Create a Job handle from an existing job ID.
   * Useful for resuming polling on a previously created job.
   */
  handle(id: string): Job {
    return new Job(this.http, { job_id: id });
  }
}
