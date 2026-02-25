import type { HttpClient } from "../client.js";
import type { BillingResponse, GetBillingOptions } from "../types.js";

export class BillingResource {
  constructor(private http: HttpClient) {}

  /** Get billing events and usage for an account. */
  async get(
    accountId: string,
    opts?: GetBillingOptions,
  ): Promise<BillingResponse> {
    return this.http.get<BillingResponse>(
      `/api/v1/billing/${encodeURIComponent(accountId)}`,
      {
        start_date: opts?.start_date,
        end_date: opts?.end_date,
        type: opts?.type,
        tags: opts?.tags,
      },
    );
  }
}
