const BASE = import.meta.env.VITE_API_URL ?? "";

/** Thrown when FastAPI / proxy is unreachable — map to localized UI message */
export const BACKEND_OFFLINE_MARKER = "__KHETIBARI_BACKEND_OFFLINE__";

/** Diseases meta blocked too long — usually Marian still translating server-side before our preload fix */
export const DISEASES_META_TIMEOUT_MARKER = "__KHETIBARI_DISEASES_META_TIMEOUT__";

export type AnalyzeOk = {
  ok: true;
  rejected: false;
  language: "en" | "ur";
  disease: string;
  confidence: number;
  confidence_band: string;
  accent_color: string;
  probabilities: { class: string; probability: number; color: string }[];
  advisory: {
    short: string;
    description: string;
    symptoms: string[];
    treatment: string[];
    prevention: string[];
    display_name: string;
  };
  heatmap_png_base64: string | null;
  summary: string;
  report_text: string;
};

export type AnalyzeRejected = {
  ok: false;
  rejected: true;
  code: "low_confidence" | "ambiguous" | "non_leaf";
  language: "en" | "ur";
};

export type AnalyzeResponse = AnalyzeOk | AnalyzeRejected;

function backendUnreachable(status: number, body: string): boolean {
  const b = body.trim().toLowerCase();
  if (status === 502 || status === 503 || status === 504) return true;
  // Vite proxy → connection refused often surfaces as 500 + "Internal Server Error"
  if (status === 500 && (b === "" || b.includes("internal server error"))) return true;
  return false;
}

async function parseJsonResponse<T>(res: Response): Promise<T> {
  const txt = await res.text();
  if (!res.ok) {
    if (backendUnreachable(res.status, txt)) throw new Error(BACKEND_OFFLINE_MARKER);
    throw new Error(txt.slice(0, 500) || res.statusText);
  }
  try {
    return JSON.parse(txt) as T;
  } catch {
    throw new Error(txt.slice(0, 300));
  }
}

export async function fetchHealth(): Promise<{
  status: string;
  model_loaded: boolean;
  model_path_exists: boolean;
  model_path?: string;
  translation_ready?: boolean;
} | null> {
  try {
    const res = await fetch(`${BASE}/api/health`);
    if (!res.ok) return null;
    return (await res.json()) as {
      status: string;
      model_loaded: boolean;
      model_path_exists: boolean;
      model_path?: string;
      translation_ready?: boolean;
    };
  } catch {
    return null;
  }
}

export async function analyzeLeaf(
  file: File,
  language: "en" | "ur"
): Promise<AnalyzeResponse> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("language", language);
  let res: Response;
  try {
    res = await fetch(`${BASE}/api/analyze`, { method: "POST", body: fd });
  } catch {
    throw new Error(BACKEND_OFFLINE_MARKER);
  }
  return parseJsonResponse<AnalyzeResponse>(res);
}

export type DiseaseMeta = {
  classes: string[];
  items: {
    key: string;
    color: string;
    advisory_en: {
      short: string;
      description: string;
      symptoms: string[];
      treatment: string[];
      prevention: string[];
    };
    advisory_ur: {
      short: string;
      description: string;
      symptoms: string[];
      treatment: string[];
      prevention: string[];
    };
  }[];
};

/** Default 5 min — first Marian download + CPU translation used to stall this route pre-startup warmup */
const DISEASES_META_FETCH_MS = 300_000;

export async function fetchDiseaseMeta(): Promise<DiseaseMeta> {
  const ctl = new AbortController();
  const timer = typeof window !== "undefined" ? window.setTimeout(() => ctl.abort(), DISEASES_META_FETCH_MS) : 0;
  let res: Response;
  try {
    try {
      res = await fetch(`${BASE}/api/meta/diseases`, { signal: ctl.signal });
    } catch (e: unknown) {
      if (e instanceof Error && e.name === "AbortError") throw new Error(DISEASES_META_TIMEOUT_MARKER);
      throw new Error(BACKEND_OFFLINE_MARKER);
    }
    return parseJsonResponse<DiseaseMeta>(res);
  } finally {
    if (timer) window.clearTimeout(timer);
  }
}

export async function fetchSpeechBase64(
  text: string,
  lang: "en" | "ur"
): Promise<string> {
  let res: Response;
  try {
    res = await fetch(`${BASE}/api/speech`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, lang }),
    });
  } catch {
    throw new Error(BACKEND_OFFLINE_MARKER);
  }
  const data = await parseJsonResponse<{ audio_base64: string }>(res);
  return data.audio_base64;
}

export function isBackendOfflineError(e: unknown): boolean {
  return e instanceof Error && e.message === BACKEND_OFFLINE_MARKER;
}

export function isDiseasesMetaTimeoutError(e: unknown): boolean {
  return e instanceof Error && e.message === DISEASES_META_TIMEOUT_MARKER;
}
