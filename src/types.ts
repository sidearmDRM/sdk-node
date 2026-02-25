// ---------------------------------------------------------------------------
// Shared enums
// ---------------------------------------------------------------------------

export type MediaType = "image" | "video" | "audio" | "gif" | "text" | "pdf";
export type AlgorithmCategory = "open" | "proprietary";
export type ProtectionLevel = "standard" | "maximum";
export type SearchTier = "exact" | "quick" | "perceptual" | "compositional" | "full";
export type DetectTier = "exact" | "quick" | "perceptual" | "compositional" | "full";
export type MembershipMethod = "pattern" | "statistical" | "combined";
export type EmbedMode = "register" | "basic" | "advanced" | "radioactive";
export type JobStatus = "queued" | "running" | "completed" | "failed";
export type JobType = "media_ingest" | "ai_detect" | "membership_inference";

// ---------------------------------------------------------------------------
// API resources
// ---------------------------------------------------------------------------

export interface Algorithm {
  id: string;
  name: string;
  summary: string;
  description: string;
  category: AlgorithmCategory;
  media_types: MediaType[];
  technique: string;
  gpu_required: boolean;
  paper_url?: string | null;
  runnable?: boolean;
  resolves_to?: string[];
}

export interface Media {
  id: string;
  account_id: string;
  media_type: MediaType;
  manifest?: string;
  storage_url?: string;
  original_storage_key?: string;
  preset?: string;
  algorithms_applied?: string[];
  deletes_at?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
  status: "active" | "processing";
  created_at: string;
  updated_at: string;
}

export interface JobData {
  id: string;
  type?: JobType;
  status: JobStatus;
  preset?: string | null;
  progress?: { completed: number; total: number } | null;
  result?: Record<string, unknown> | null;
  error?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Rights {
  media_id: string;
  c2pa?: Record<string, unknown>;
  schema_org?: Record<string, unknown>;
  iptc?: Record<string, unknown>;
  tdm?: Record<string, unknown>;
  rsl?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface BillingEvent {
  id: string;
  type: string;
  credits?: number;
  created_at: string;
  tags?: string[];
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Request options
// ---------------------------------------------------------------------------

export interface ListAlgorithmsOptions {
  category?: AlgorithmCategory;
  media_type?: MediaType;
}

export interface RunOptions {
  algorithms: string[];
  media_url?: string;
  media?: string;
  text?: string;
  mime?: string;
  tags?: string[];
  webhook_url?: string;
  c2pa_wrap?: boolean;
  filename?: string;
}

export interface ProtectOptions {
  media_url?: string;
  media?: string;
  text?: string;
  mime?: string;
  level?: ProtectionLevel;
  tags?: string[];
  webhook_url?: string;
  filename?: string;
}

export interface SearchOptions {
  media_url?: string;
  media?: string;
  type?: SearchTier;
  tags?: string[];
  limit?: number;
}

export interface DetectAiOptions {
  media_url?: string;
  media?: string;
  text?: string;
  mime?: string;
  tags?: string[];
}

export interface DetectFingerprintOptions {
  media_url?: string;
  media?: string;
  tags?: string[];
  tier?: DetectTier;
}

export interface DetectMembershipOptions {
  content_ids: string[];
  suspect_model: string;
  method?: MembershipMethod;
  tags?: string[];
}

export interface RegisterMediaOptions {
  media_url?: string;
  media?: string;
  mode?: EmbedMode;
  expires_at?: string;
  tags?: string[];
}

export interface UpdateMediaOptions {
  original_media_url: string;
}

export interface GetBillingOptions {
  start_date?: string;
  end_date?: string;
  type?: string;
  tags?: string;
}

export interface PaginationOptions {
  cursor?: string;
  limit?: number;
}

// ---------------------------------------------------------------------------
// Response types
// ---------------------------------------------------------------------------

export interface JobCreatedResponse {
  job_id: string;
  status_url: string;
}

export interface SearchResult {
  media_id: string;
  score: number;
  tier: string;
  media?: Media;
  [key: string]: unknown;
}

export interface SearchResponse {
  results: SearchResult[];
  [key: string]: unknown;
}

export interface PaginatedResponse<T> {
  data: T[];
  cursor?: string | null;
  has_more?: boolean;
}

export interface BillingResponse {
  events: BillingEvent[];
  portal_url?: string;
}

export interface SidearmConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface WaitOptions {
  /** Maximum time to wait in milliseconds. Default: 120000 (2 minutes). */
  timeoutMs?: number;
  /** Polling interval in milliseconds. Default: 2000 (2 seconds). */
  intervalMs?: number;
}
