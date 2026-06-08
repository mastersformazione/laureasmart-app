import type { EsameCfu } from "./types";
import { normalizeSSD } from "./ssd";

export type EsameEstrattoDaDocumento = {
  nome?: string;
  ssd?: string;
  cfu?: number | string;
  voto?: string | number | null;
  esito?: string | null;
  data?: string | null;
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

function normalizzaNomePerConfronto(nome: string): string {
  return nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\b(?:esame|insegnamento|attivita|formativa|modulo)\b/g, " ")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function contaCampiUtili(item: EsameEstrattoDaDocumento): number {
  let score = 0;
  if (item.nome) score += 1;
  if (item.ssd) score += 1;
  if (item.cfu) score += 1;
  if (item.voto) score += 2;
  if (item.esito) score += 2;
  if (item.data) score += 1;
  if (item.livello) score += 1;
  if (item.sourceFile) score += 1;
  if (typeof item.confidence === "number") score += item.confidence;
  return score;
}

function scegliMigliore(
  corrente: EsameEstrattoDaDocumento,
  candidato: EsameEstrattoDaDocumento
): EsameEstrattoDaDocumento {
  return contaCampiUtili(candidato) > contaCampiUtili(corrente) ? candidato : corrente;
}

export function normalizzaEsamiEstratti(items: unknown[]): EsameCfu[] {
  const dedup = new Map<string, EsameEstrattoDaDocumento>();

  for (const raw of items || []) {
    if (!raw || typeof raw !== "object") continue;
    const item = raw as EsameEstrattoDaDocumento;

    const nome = String(item.nome || "").replace(/\s+/g, " ").trim();
    const ssd = normalizeSSD(String(item.ssd || "").trim());
    const cfu = normalizzaCfu(item.cfu);

    if (!nome && !ssd && !cfu) continue;
    if (!ssd || !cfu) continue;

    const nomeKey = normalizzaNomePerConfronto(nome);
    if (!nomeKey) continue;

    const key = `${nomeKey}|${ssd}|${cfu}`;
    const candidato: EsameEstrattoDaDocumento = {
      ...item,
      nome,
      ssd,
      cfu,
    };

    const existing = dedup.get(key);
    dedup.set(key, existing ? scegliMigliore(existing, candidato) : candidato);
  }

  return Array.from(dedup.values()).map((item) => ({
    id: creaId(),
    nome: String(item.nome || "Esame rilevato").replace(/\s+/g, " ").trim(),
    ssd: normalizeSSD(String(item.ssd || "").trim()),
    cfu: normalizzaCfu(item.cfu),
    livello: normalizzaLivello(item.livello),
  }));
}
