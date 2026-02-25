# @sidearmdrm/sdk-node-node

TypeScript client for the [Sidearm API](https://sdrm.io). Protect media from AI training, detect AI content, search for stolen work.

## Install

```bash
npm install @sidearmdrm/sdk-node
```

## Quick Start

```typescript
import { Sidearm } from "@sidearmdrm/sdk-node";
const client = new Sidearm({ apiKey: "sk_live_..." });
const job = await client.protect({
  media_url: "https://example.com/art.png",
  level: "maximum",
});
const result = await job.wait();
```

## Protection

```typescript
// Preset level (auto-selects algorithms)
const job = await client.protect({
  media_url: "https://...",
  level: "standard",
  tags: ["portfolio"],
});

// Run specific algorithms by name
const job2 = await client.run({
  algorithms: ["nightshade", "glaze", "hmark"],
  media_url: "https://...",
});
```

## Job Polling

Async endpoints return a Job handle with built-in polling:

```typescript
// Wait until done
const result = await job.wait({ timeoutMs: 120_000, intervalMs: 2_000 });

// Manual poll
const status = await job.poll();

// Resume from a previous job ID
const resumed = client.jobs.handle("job-uuid");
await resumed.wait();
```

## Algorithms

```typescript
const all = await client.algorithms.list();
const audio = await client.algorithms.list({ media_type: "audio" });
const open = await client.algorithms.list({ category: "open" });
```

## Detection

```typescript
// AI content detection (async)
const aiJob = await client.detect.ai({ media_url: "https://..." });
const aiResult = await aiJob.wait();

// Fingerprint detection (sync)
const matches = await client.detect.fingerprint({
  media_url: "https://...",
  tier: "perceptual",
});

// Membership inference
const memJob = await client.detect.membership({
  content_ids: ["uuid-1", "uuid-2"],
  suspect_model: "stable-diffusion-xl",
  method: "combined",
});
await memJob.wait();
```

## Search

```typescript
const results = await client.search.run({
  media_url: "https://...",
  type: "perceptual",
  limit: 10,
});

const history = await client.search.list({ limit: 20 });
```

## Media Management

```typescript
await client.media.register({ media_url: "https://...", mode: "basic" });
const library = await client.media.list({ limit: 50 });
const asset = await client.media.get("uuid");
await client.media.update("uuid", { original_media_url: "https://..." });
await client.media.delete("uuid");
```

## Rights and Billing

```typescript
const rights = await client.rights.get("media-uuid");
const billing = await client.billing.get("account-uuid", {
  start_date: "2026-01-01",
});
```

## Error Handling

```typescript
import { Sidearm, SidearmError } from "@sidearmdrm/sdk-node";

try {
  await client.protect({ media_url: "..." });
} catch (err) {
  if (err instanceof SidearmError) {
    console.error(err.message); // Human-readable message
    console.error(err.status);  // HTTP status code
    console.error(err.body);    // Raw response body
  }
}
```

## Requirements

- Node.js 18+ or modern browser (native fetch)
- Zero runtime dependencies
- Full TypeScript types included

## License

MIT
