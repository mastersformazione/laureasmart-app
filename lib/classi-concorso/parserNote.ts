import type { RequisitoCfu } from "./types";
import { normalizeArea } from "./ssd";

const KNOWN_AREAS = new Set([
  "MAT", "FIS", "CHIM", "GEO", "BIO", "INF", "ICAR", "ING-INF", "ING-IND",
  "SECS-S", "SECS-P", "L-LIN", "L-FIL-LET", "M-PSI", "M-PED", "M-FIL",
  "M-STO", "M-GGR", "M-DEA", "SPS", "IUS", "MED", "AGR", "VET",
]);

const STOP_WORDS = new Set([
  "DI",
  "CUI",
  "ALMENO",
  "CFU",
  "SSD",
  "SETTORI",
  "SETTORE",
  "SCIENTIFICO",
  "DISCIPLINARI",
  "DISCIPLINARE",
  "COMPLESSIVI",
  "COMPLESSIVAMENTE",
  "TRA",
  "FRA",
  "E",
  "O",
  "IN",
  "NEI",
  "NEL",
  "NELL",
  "NELLA",
  "NELLE",
  "DEI",
  "DEL",
  "DELLA",
  "DELLE",
]);

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function extractSectors(text: string): string[] {
  const normalized = text.toUpperCase().replace(/\\/g, "/");
  const exactCodes = normalized.match(/[A-Z]+(?:-[A-Z]+)?\/\d{2}/g) || [];

  const areas = (normalized.match(/\b[A-Z]{2,8}(?:-[A-Z]{1,8})?\b/g) || [])
    .filter((token) => !STOP_WORDS.has(token))
    .filter((token) => KNOWN_AREAS.has(token));

  return unique([...exactCodes, ...areas].map(normalizeArea));
}

function cleanFragment(fragment: string): string {
  return fragment
    .replace(/^[,;:.\s]+/, "")
    .replace(/[,;:.\s]+$/, "")
    .trim();
}

export function parseRequisitiDaNota(note: string): {
  requisiti: RequisitoCfu[];
  nonInterpretati: string[];
} {
  const cleanNote = (note || "").replace(/\s+/g, " ").trim();

  if (!cleanNote || !/CFU/i.test(cleanNote)) {
    return { requisiti: [], nonInterpretati: [] };
  }

  const requisiti: RequisitoCfu[] = [];
  const nonInterpretati: string[] = [];
  const regex = /(?:almeno|con almeno|di cui almeno|complessivi(?: tra)?|complessivamente)?\s*(\d{1,3})\s*CFU\s*(?:complessivi|complessivamente)?\s*(?:nei\s+SSD|nei\s+settori\s+scientifico\s+disciplinari|nei\s+settori|nel\s+settore|in|tra|fra)?\s*([^.;\[\]]*)/gi;

  let match: RegExpExecArray | null;

  while ((match = regex.exec(cleanNote)) !== null) {
    const cfuRichiesti = Number(match[1]);
    const fragment = cleanFragment(match[2] || "");
    const settori = extractSectors(fragment);

    if (!cfuRichiesti || settori.length === 0) {
      nonInterpretati.push(cleanFragment(match[0]));
      continue;
    }

    requisiti.push({
      id: `${requisiti.length}-${cfuRichiesti}-${settori.join("-")}`,
      label:
        settori.length === 1
          ? `${cfuRichiesti} CFU in ${settori[0]}`
          : `${cfuRichiesti} CFU nei settori ${settori.join(", ")}`,
      cfuRichiesti,
      settori,
      tipo: settori.length === 1 && settori[0].includes("/") ? "settore" : settori.length === 1 ? "area" : "gruppo",
      fonte: cleanNote,
    });
  }

  if (requisiti.length === 0) {
    nonInterpretati.push(cleanNote);
  }

  return { requisiti, nonInterpretati };
}
