import { HttpClient } from "./client.js";
import { AlgorithmsResource } from "./resources/algorithms.js";
import { RunResource } from "./resources/run.js";
import { ExtractResource } from "./resources/extract.js";
import { ProtectResource } from "./resources/protect.js";
import { JobsResource } from "./resources/jobs.js";
import { SearchResource } from "./resources/search.js";
import { DetectResource } from "./resources/detect.js";
import { MediaResource } from "./resources/media.js";
import { RightsResource } from "./resources/rights.js";
import { BillingResource } from "./resources/billing.js";
import { SharesResource } from "./resources/shares.js";
import type { SidearmConfig, RunOptions, ExtractOptions, ProtectOptions } from "./types.js";
import type { Job } from "./job.js";

/**
 * Sidearm API client.
 *
 * ```ts
 * import { Sidearm } from '@sidearmdrm/sdk-node';
 *
 * const client = new Sidearm({ apiKey: 'sk_live_...' });
 * const job = await client.protect({ media_url: '...', level: 'maximum' });
 * const result = await job.wait();
 * ```
 */
export class Sidearm {
  /** Browse and discover available algorithms. */
  readonly algorithms: AlgorithmsResource;
  /** Poll and manage async jobs. */
  readonly jobs: JobsResource;
  /** Similarity search across your media library. */
  readonly search: SearchResource;
  /** AI content detection, fingerprint detection, membership inference. */
  readonly detect: DetectResource;
  /** Register, list, update, and delete media assets. */
  readonly media: MediaResource;
  /** Rights and licensing information. */
  readonly rights: RightsResource;
  /** Billing and usage events. */
  readonly billing: BillingResource;
  /** Create and manage shareable result links. */
  readonly shares: SharesResource;

  private _run: RunResource;
  private _extract: ExtractResource;
  private _protect: ProtectResource;

  constructor(config: SidearmConfig) {
    const http = new HttpClient(config);

    this.algorithms = new AlgorithmsResource(http);
    this._run = new RunResource(http);
    this._extract = new ExtractResource(http);
    this._protect = new ProtectResource(http);
    this.jobs = new JobsResource(http);
    this.search = new SearchResource(http);
    this.detect = new DetectResource(http);
    this.media = new MediaResource(http);
    this.rights = new RightsResource(http);
    this.billing = new BillingResource(http);
    this.shares = new SharesResource(http);
  }

  /**
   * Run one or more named algorithms on media.
   * Returns a `Job` handle for polling the async result.
   */
  run(opts: RunOptions): Promise<Job> {
    return this._run.execute(opts);
  }

  /**
   * Extract raw embedding vectors from media using one or more named algorithms.
   * Returns a `Job` handle for polling the async result.
   * The job result contains: { embeddings, media_type, algorithms_applied, algorithms_failed }
   */
  extract(opts: ExtractOptions): Promise<Job> {
    return this._extract.execute(opts);
  }

  /**
   * Protect media with a curated preset level (standard or maximum).
   * Returns a `Job` handle for polling the async result.
   */
  protect(opts: ProtectOptions): Promise<Job> {
    return this._protect.execute(opts);
  }
}

// Re-export everything consumers might need
export { SidearmError } from "./client.js";
export { Job } from "./job.js";
export type * from "./types.js";
