import type { RequisitoCfu } from "./types";
import { normalizeArea } from "./ssd";

const KNOWN_AREAS = new Set([
  "MAT",
  "FIS",
  "CHIM",
  "GEO",
  "BIO",
  "INF",
  "ICAR",
  "ING-INF",
  "ING-IND",
  "SECS-S",
  "SECS-P",
  "L-LIN",
  "L-FIL-LET",
  "M-PSI",
  "M-PED",
  "M-FIL",
  "M-STO",
  "M-GGR",
  "M-DEA",
  "SPS",
  "IUS",
  "MED",
  "AGR",
  "VET",
  "L-ANT",
  "L-ART",
  "L-OR",
  "M-EDF",
  "M-AGR",
  "SECS",
]);

const STOP_WORDS = new Set([
  "DI",
  "CUI",
  "ALMENO",
  "MINIMO",
  "MASSIMO",
  "CFU",
  "CREDITO",
  "CREDITI",
  "SSD",
  "SETTORI",
  "SETTORE",
  "SCIENTIFICO",
  "SCIENTIFICI",
  "DISCIPLINARI",
  "DISCIPLINARE",
  "COMPLESSIVI",
  "COMPLESSIVAMENTE",
  "TRA",
  "FRA",
  "E",
  "O",
  "OPPURE",
  "IN",
  "NEI",
  "NEL",
  "NELL",
  "NELLAREA",
  "NELL'AREA",
  "NELL’AREA",
  "NELLA",
  "NELLE",
  "DEI",
  "DEL",
  "DELLA",
  "DELLE",
  "CON",
  "NON",
  "MENO",
  "PER",
  "UN",
  "UNA",
  "AREA",
  "AMBITO",
  "AMBITI",
]);

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function cleanFragment(fragment: string): string {
  return fragment
    .replace(/^[,;:.\s]+/, "")
    .replace(/[,;:.\s]+$/, "")
    .trim();
}

function normalizeNote(note: string): string {
  return (note || "")
    .replace(/[“”]/g, '"')
    .replace(/[’]/g, "'")
    .replace(/\\/g, "/")
    .replace(/\s+/g, " ")
    .trim();
}

function getTipoRequisito(settori: string[]): RequisitoCfu["tipo"] {
  if (settori.length === 1 && settori[0].includes("/")) return "settore";
  if (settori.length === 1) return "area";
  return "gruppo";
}

function scoreSectorSpecificity(settori: string[]): number {
  return settori.reduce((score, settore) => score + (settore.includes("/") ? 2 : 1), 0);
}

function createRequirement(
  requisiti: RequisitoCfu[],
  cfuRichiesti: number,
  settori: string[],
  fonte: string,
  forcedLabel?: string
): RequisitoCfu | null {
  const cleanSettori = unique(settori.map(normalizeArea));

  if (!cfuRichiesti || cleanSettori.length === 0) return null;

  const label =
    forcedLabel ||
    (cleanSettori.length === 1
      ? `${cfuRichiesti} CFU in ${cleanSettori[0]}`
      : `${cfuRichiesti} CFU nei settori ${cleanSettori.join(", ")}`);

  return {
    id: `${requisiti.length}-${cfuRichiesti}-${cleanSettori.join("-")}`,
    label,
    cfuRichiesti,
    settori: cleanSettori,
    tipo: getTipoRequisito(cleanSettori),
    fonte,
  };
}

/**
 * Espande formule compatte del tipo:
 * - L-ANT/02 o 03
 * - M-STO/01, 02 o 04
 * - MAT/03 o ICAR/17
 */
function expandCompactSectorCodes(text: string): string[] {
  const normalized = text.toUpperCase().replace(/\\/g, "/");
  const sectors: string[] = [];

  const exactCodes = normalized.match(/[A-Z]+(?:-[A-Z]+)?\/\d{2}/g) || [];
  sectors.push(...exactCodes);

  const baseCodeRegex = /([A-Z]+(?:-[A-Z]+)?)\/(\d{2})((?:\s*(?:,|E|O|OPPURE)\s*\d{2})+)/g;
  let baseMatch: RegExpExecArray | null;

  while ((baseMatch = baseCodeRegex.exec(normalized)) !== null) {
    const base = baseMatch[1];
    const first = baseMatch[2];
    const tail = baseMatch[3];

    sectors.push(`${base}/${first}`);

    const additionalNumbers = tail.match(/\d{2}/g) || [];
    for (const number of additionalNumbers) {
      sectors.push(`${base}/${number}`);
    }
  }

  return unique(sectors.map(normalizeArea));
}

/**
 * Estrae aree e SSD da frammenti come:
 * - MAT, FIS, CHIM
 * - L-FIL-LET/04
 * - M-STO/01 o 02 o 04
 */
function extractSectors(text: string): string[] {
  const normalized = text.toUpperCase().replace(/\\/g, "/");

  const exactAndExpanded = expandCompactSectorCodes(normalized);

  const areas = (normalized.match(/\b[A-Z]{2,8}(?:-[A-Z]{1,8})?(?:-[A-Z]{1,8})?\b/g) || [])
    .filter((token) => !STOP_WORDS.has(token))
    .filter((token) => KNOWN_AREAS.has(token));

  return unique([...exactAndExpanded, ...areas].map(normalizeArea));
}

function cutFragmentAtNextRequirement(fragment: string): string {
  return fragment
    .replace(
      /\b(di cui|e almeno|non meno di|con almeno|almeno)\s+\d{1,3}\s*(CFU|crediti|credito)?\b.*$/i,
      ""
    )
    .trim();
}

function parseExplicitCfuRequirements(cleanNote: string, requisiti: RequisitoCfu[], nonInterpretati: string[]) {
  /**
   * Riconosce:
   * - almeno 12 CFU in MAT/01
   * - con almeno 60 CFU nei SSD MAT
   * - di cui almeno 24 CFU in MAT
   * - almeno 84 crediti nei settori MAT, FIS, CHIM
   */
  const regex =
    /(?:con\s+)?(?:almeno|non\s+meno\s+di|di\s+cui\s+(?:almeno\s+)?|complessivi(?:\s+tra)?|complessivamente)?\s*(\d{1,3})\s*(?:CFU|crediti|credito)\s*(?:complessivi|complessivamente)?\s*(?:nei\s+SSD|nei\s+settori\s+scientifico\s+disciplinari|nei\s+settori|nel\s+settore|nell['’]area|nell'area|in|tra|fra)?\s*([^.;\[\]]{0,280})/gi;

  let match: RegExpExecArray | null;

  while ((match = regex.exec(cleanNote)) !== null) {
    const cfuRichiesti = Number(match[1]);
    const rawFragment = cleanFragment(match[2] || "");
    const fragment = cleanFragment(cutFragmentAtNextRequirement(rawFragment));
    const settori = extractSectors(fragment);

    if (!cfuRichiesti || settori.length === 0) {
      nonInterpretati.push(cleanFragment(match[0]));
      continue;
    }

    const requirement = createRequirement(requisiti, cfuRichiesti, settori, cleanNote);
    if (requirement) requisiti.push(requirement);
  }
}

function parseCompactRequirementsWithoutCfuWord(
  cleanNote: string,
  requisiti: RequisitoCfu[]
) {
  /**
   * Riconosce casi ministeriali frequenti dove dopo "di cui" manca la parola CFU:
   * - di cui 12 L-FIL-LET/04
   * - 24 tra L-ANT/02 o 03 e M-STO/01 o 02 o 04
   * - 12 in MAT/03 o ICAR/17
   */
  const regex =
    /(?:di\s+cui\s+|e\s+|,\s*)?(?:almeno\s+)?(\d{1,3})\s*(?:nei\s+SSD|nei\s+settori|nel\s+settore|in|tra|fra)?\s*((?:[A-Z]+(?:-[A-Z]+)?(?:-[A-Z]+)?\/\d{2}|[A-Z]+(?:-[A-Z]+)?(?:-[A-Z]+)?)(?:\s*(?:,|e|o|oppure)\s*(?:[A-Z]+(?:-[A-Z]+)?(?:-[A-Z]+)?\/)?\d{2}|(?:\s*(?:,|e|o|oppure)\s*[A-Z]+(?:-[A-Z]+)?(?:-[A-Z]+)?\/\d{2})|\s*(?:,|e|o|oppure)\s*[A-Z]+(?:-[A-Z]+)?(?:-[A-Z]+)?){0,12})/gi;

  let match: RegExpExecArray | null;

  while ((match = regex.exec(cleanNote)) !== null) {
    const cfuRichiesti = Number(match[1]);
    const fragment = cleanFragment(match[2] || "");
    const settori = extractSectors(fragment);

    if (!cfuRichiesti || settori.length === 0) continue;

    const requirement = createRequirement(requisiti, cfuRichiesti, settori, cleanNote);
    if (requirement) requisiti.push(requirement);
  }
}

function removeDuplicateRequirements(requisiti: RequisitoCfu[]): RequisitoCfu[] {
  const map = new Map<string, RequisitoCfu>();

  for (const req of requisiti) {
    const sortedSettori = [...req.settori].sort();
    const key = `${req.cfuRichiesti}|${sortedSettori.join("|")}`;

    const existing = map.get(key);
    if (!existing) {
      map.set(key, req);
      continue;
    }

    const existingScore = scoreSectorSpecificity(existing.settori);
    const currentScore = scoreSectorSpecificity(req.settori);

    if (currentScore > existingScore) {
      map.set(key, req);
    }
  }

  return Array.from(map.values()).map((req, index) => ({
    ...req,
    id: `${index}-${req.cfuRichiesti}-${req.settori.join("-")}`,
  }));
}

function removeOverBroadRequirements(requisiti: RequisitoCfu[]): RequisitoCfu[] {
  /**
   * Evita doppioni grossolani quando una formula viene letta sia come area sia come SSD
   * identico. Mantiene entrambi solo se hanno CFU diversi.
   */
  return requisiti.filter((req, index, all) => {
    const hasMoreSpecificTwin = all.some((other, otherIndex) => {
      if (index === otherIndex) return false;
      if (req.cfuRichiesti !== other.cfuRichiesti) return false;
      if (req.settori.length !== 1 || other.settori.length !== 1) return false;

      const current = req.settori[0];
      const compared = other.settori[0];

      return !current.includes("/") && compared.startsWith(`${current}/`);
    });

    return !hasMoreSpecificTwin;
  });
}

export function parseRequisitiDaNota(note: string): {
  requisiti: RequisitoCfu[];
  nonInterpretati: string[];
} {
  const cleanNote = normalizeNote(note);

  if (!cleanNote || !/(CFU|crediti|credito|\d{1,3}\s+[A-Z]+(?:-[A-Z]+)?\/\d{2})/i.test(cleanNote)) {
    return { requisiti: [], nonInterpretati: [] };
  }

  const requisiti: RequisitoCfu[] = [];
  const nonInterpretati: string[] = [];

  parseExplicitCfuRequirements(cleanNote, requisiti, nonInterpretati);
  parseCompactRequirementsWithoutCfuWord(cleanNote, requisiti);

  const deduplicati = removeDuplicateRequirements(removeOverBroadRequirements(requisiti));

  if (deduplicati.length === 0) {
    nonInterpretati.push(cleanNote);
  }

  return {
    requisiti: deduplicati,
    nonInterpretati,
  };
}