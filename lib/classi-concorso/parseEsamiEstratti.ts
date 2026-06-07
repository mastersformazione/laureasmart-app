import type { EsameCfu } from "./types";
import { normalizeSSD } from "./ssd";

export type EsameEstrattoDaDocumento = {
  nome?: string;
  ssd?: string;
  cfu?: number | string;
  voto?: string | number | null;
  livello?: string | null;
  sourceFile?: string | null;
  confidence?: number | null;
};

const LIVELLI_AMMESSI = ["triennale", "magistrale", "ciclo_unico", "altro"] as const;

type Livello = EsameCfu["livello"];

function normalizzaLivello(value?: string | null): Livello {
  const raw = String(value || "").trim().toLowerCase();
  if (raw.includes("magistr")) return "magistrale";
  if (raw.includes("trien")) return "triennale";
  if (raw.includes("ciclo") || raw.includes("unico")) return "ciclo_unico";
  if ((LIVELLI_AMMESSI as readonly string[]).includes(raw)) return raw as Livello;
  return "altro";
}

function normalizzaCfu(value: number | string | undefined): number {
  if (typeof value === "number" && Number.isFinite(value)) return Math.max(0, value);
  const parsed = Number(String(value || "").replace(",", ".").match(/\d+(?:\.\d+)?/)?.[0] || 0);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function creaId(prefix = "doc-exam") {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function normalizzaEsamiEstratti(items: EsameEstrattoDaDocumento[]): EsameCfu[] {
  const seen = new Set<string>();
  const normalized: EsameCfu[] = [];

  for (const item of items || []) {
    const nome = String(item.nome || "").replace(/\s+/g, " ").trim();
    const ssd = normalizeSSD(String(item.ssd || "").trim());
    const cfu = normalizzaCfu(item.cfu);

    if (!nome && !ssd && !cfu) continue;
    if (!ssd || !cfu) continue;

    const key = `${nome.toLowerCase()}|${ssd}|${cfu}`;
    if (seen.has(key)) continue;
    seen.add(key);

    normalized.push({
      id: creaId(),
      nome: nome || "Esame rilevato",
      ssd,
      cfu,
      livello: normalizzaLivello(item.livello),
    });
  }

  return normalized;
}
