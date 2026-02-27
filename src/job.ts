import type { HttpClient } from "./client.js";
import type { JobData, WaitOptions } from "./types.js";

const DEFAULT_TIMEOUT_MS = 120_000;
const DEFAULT_INTERVAL_MS = 2_000;

/**
 * Handle to an asynchronous Sidearm job. Provides helpers for polling
 * and waiting until the job reaches a terminal state.
 */
export class Job {
  public readonly id: string;
  private http: HttpClient;
  private _latest: JobData;

  constructor(http: HttpClient, data: { job_id: string; status_url?: string }) {
    this.http = http;
    this.id = data.job_id;
    this._latest = {
      id: data.job_id,
      status: "queued",
    };
  }

  /** Most recently fetched job data. */
  get latest(): JobData {
    return this._latest;
  }

  /** Whether the job has reached a terminal state (completed or failed). */
  get done(): boolean {
    return this._latest.status === "completed" || this._latest.status === "failed";
  }

  /**
   * Fetch the current job state from the API. Returns the updated `JobData`.
   */
  async poll(): Promise<JobData> {
    this._latest = await this.http.getOne<JobData>(
      `/api/v1/jobs/${encodeURIComponent(this.id)}`,
    );
    return this._latest;
  }

  /**
   * Poll until the job completes or fails, then return the final state.
   * Throws if the timeout is exceeded.
   *
   * @param opts.timeoutMs  Max wait time (default: 120 000 ms / 2 min)
   * @param opts.intervalMs Polling interval (default: 2 000 ms)
   */
  async wait(opts?: WaitOptions): Promise<JobData> {
    const timeout = opts?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    const interval = opts?.intervalMs ?? DEFAULT_INTERVAL_MS;
    const deadline = Date.now() + timeout;

    while (!this.done) {
      if (Date.now() >= deadline) {
        throw new Error(
          `Job ${this.id} did not complete within ${timeout}ms (last status: ${this._latest.status})`,
        );
      }
      await sleep(interval);
      await this.poll();
    }

    return this._latest;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
