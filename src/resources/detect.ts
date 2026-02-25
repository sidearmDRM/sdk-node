import type { HttpClient } from "../client.js";
import { Job } from "../job.js";
import type {
  DetectAiOptions,
  DetectFingerprintOptions,
  DetectMembershipOptions,
  JobCreatedResponse,
} from "../types.js";

export class DetectResource {
  constructor(private http: HttpClient) {}

  /**
   * Detect whether media was AI-generated.
   * Returns a `Job` handle for polling the async result.
   */
  async ai(opts: DetectAiOptions): Promise<Job> {
    const res = await this.http.post<JobCreatedResponse>(
      "/api/v1/detect/ai",
      opts,
    );
    return new Job(this.http, res);
  }

  /** Synchronous fingerprint detection against your indexed library. */
  async fingerprint(opts: DetectFingerprintOptions): Promise<unknown> {
    return this.http.post("/api/v1/detect", opts);
  }

  /**
   * Membership inference — test whether content was used to train a model.
   * Returns a `Job` handle for polling the async result.
   */
  async membership(opts: DetectMembershipOptions): Promise<Job> {
    const res = await this.http.post<JobCreatedResponse>(
      "/api/v1/detect/membership",
      opts,
    );
    return new Job(this.http, res);
  }
}
