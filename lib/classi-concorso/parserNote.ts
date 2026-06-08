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
  "CIASCUNO",
  "CIASCUN",
  "OGNI",
  "OGNUNO",
  "RISPETTIVAMENTE",
  "SOMMANDO",
  "SOMMA",
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
    .replace(/\bSPS\s+(\d{1,2})\b/gi, "SPS/$1")
    .trim();
}

function normalizeCommonCompactAreas(text: string): string {
  return text
    .toUpperCase()
    .replace(/\\/g, "/")
    .replace(/\bMPSI\b/g, "M-PSI")
    .replace(/\bMPED\b/g, "M-PED")
    .replace(/\bMFIL\b/g, "M-FIL")
    .replace(/\bMSTO\b/g, "M-STO")
    .replace(/\bMGGR\b/g, "M-GGR")
    .replace(/\bLANT\b/g, "L-ANT")
    .replace(/\bLLIN\b/g, "L-LIN")
    .replace(/\bLFILLET\b/g, "L-FIL-LET")
    .replace(/\bSPS\s+(\d{1,2})\b/g, "SPS/$1");
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
      : `${cfuRichiesti} CFU tra ${cleanSettori.join(", ")}`);

  return {
    id: `${requisiti.length}-${cfuRichiesti}-${cleanSettori.join("-")}`,
    label,
    cfuRichiesti,
    settori: cleanSettori,
    tipo: getTipoRequisito(cleanSettori),
    fonte,
  };
}

function shouldSplitAsPerSectorRequirement(
  rawFragment: string,
  rawMatch: string,
  settori: string[]
): boolean {
  if (settori.length <= 1) return false;

  const fragment = `${rawMatch} ${rawFragment}`.toUpperCase();

  const hasOnlyExactSsd = settori.every((settore) => settore.includes("/"));
  if (!hasOnlyExactSsd) return false;

  const isExplicitGroupSum =
    /\b(TRA|FRA|SOMMANDO|SOMMA|COMPLESSIVI|COMPLESSIVAMENTE|NEL\s+COMPLESSO|IN\s+TOTALE|TOTALI)\b/i.test(
      fragment
    );

  if (isExplicitGroupSum) return false;

  const isExplicitEach =
    /\b(CIASCUNO|CIASCUN|OGNI|OGNUNO|PER\s+OGNI|PER\s+CIASCUN|PER\s+CIASCUNO|RISPETTIVAMENTE)\b/i.test(
      fragment
    );

  if (isExplicitEach) return true;

  const hasCompactSlashChain =
    /[A-Z]+(?:-[A-Z]+)?(?:-[A-Z]+)?\/?\d{1,2}\s*\/\s*\d{1,2}(?:\s*\/\s*\d{1,2})+/i.test(
      fragment
    );

  const hasInPreposition = /\b(IN|NEL|NEI|NEL\s+SETTORE|NEI\s+SETTORI|NEI\s+SSD)\b/i.test(fragment);

  return hasCompactSlashChain && hasInPreposition;
}

function addRequirementOrSplitBySector({
  requisiti,
  cfuRichiesti,
  settori,
  fonte,
  rawFragment,
  rawMatch,
}: {
  requisiti: RequisitoCfu[];
  cfuRichiesti: number;
  settori: string[];
  fonte: string;
  rawFragment: string;
  rawMatch: string;
}) {
  const cleanSettori = unique(settori.map(normalizeArea));

  if (!cfuRichiesti || cleanSettori.length === 0) return;

  const split = shouldSplitAsPerSectorRequirement(rawFragment, rawMatch, cleanSettori);

  if (split) {
    for (const settore of cleanSettori) {
      const requirement = createRequirement(
        requisiti,
        cfuRichiesti,
        [settore],
        fonte,
        `${cfuRichiesti} CFU in ${settore}`
      );

      if (requirement) requisiti.push(requirement);
    }

    return;
  }

  const requirement = createRequirement(requisiti, cfuRichiesti, cleanSettori, fonte);
  if (requirement) requisiti.push(requirement);
}

function expandCompactSectorCodes(text: string): string[] {
  const normalized = normalizeCommonCompactAreas(text);
  const sectors: string[] = [];

  const exactCodes = normalized.match(/[A-Z]+(?:-[A-Z]+)?(?:-[A-Z]+)?\/\d{1,2}/g) || [];
  sectors.push(...exactCodes.map((code) => code.replace(/\/(\d)$/g, "/0$1")));

  /*
    M-FIL/03 o 04
    M-FIL/06 o 07 o 08
    M-STO/01, 02 o 04
  */
  const baseCodeRegex =
    /([A-Z]+(?:-[A-Z]+)?(?:-[A-Z]+)?)\/(\d{1,2})((?:\s*(?:,|E|O|OPPURE|\/)\s*\d{1,2})+)/g;

  let baseMatch: RegExpExecArray | null;

  while ((baseMatch = baseCodeRegex.exec(normalized)) !== null) {
    const base = baseMatch[1];
    const first = baseMatch[2];
    const tail = baseMatch[3];

    sectors.push(`${base}/${first.padStart(2, "0")}`);

    const additionalNumbers = tail.match(/\d{1,2}/g) || [];
    for (const number of additionalNumbers) {
      sectors.push(`${base}/${number.padStart(2, "0")}`);
    }
  }

  /*
    M-PSI/01/02/05
  */
  const slashChainRegex = /([A-Z]+(?:-[A-Z]+)?(?:-[A-Z]+)?)\/(\d{1,2}(?:\/\d{1,2}){1,8})/g;
  let slashChainMatch: RegExpExecArray | null;

  while ((slashChainMatch = slashChainRegex.exec(normalized)) !== null) {
    const base = slashChainMatch[1];
    const numbers = slashChainMatch[2].split("/").filter(Boolean);

    for (const number of numbers) {
      sectors.push(`${base}/${number.padStart(2, "0")}`);
    }
  }

  /*
    MPSI1/2/5 oppure MPSI 1/2/5
  */
  const compactNoSlashRegex =
    /\b(M-PSI|MPSI|M-PED|MPED|M-FIL|MFIL|M-STO|MSTO|M-GGR|MGGR|L-ANT|LANT|L-LIN|LLIN|L-FIL-LET|LFILLET|MAT|FIS|CHIM|BIO|GEO|INF|IUS|MED|SPS|ICAR)\s*-?\s*(\d{1,2}(?:\s*\/\s*\d{1,2}){1,8})\b/g;

  let compactNoSlashMatch: RegExpExecArray | null;

  while ((compactNoSlashMatch = compactNoSlashRegex.exec(normalized)) !== null) {
    const rawBase = compactNoSlashMatch[1];
    const base = normalizeArea(rawBase);
    const numbers = compactNoSlashMatch[2]
      .split("/")
      .map((item) => item.trim())
      .filter(Boolean);

    for (const number of numbers) {
      sectors.push(`${base}/${number.padStart(2, "0")}`);
    }
  }

  return unique(sectors.map(normalizeArea));
}

function extractSectors(text: string): string[] {
  const normalized = normalizeCommonCompactAreas(text);

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

function hasStructuredDiCuiBlocks(cleanNote: string): boolean {
  const normalized = normalizeCommonCompactAreas(cleanNote);

  if (!/\bDI\s+CUI\b/i.test(normalized)) return false;

  const afterDiCui = normalized.split(/\bDI\s+CUI\b/i).slice(1).join(" ");
  const blockMatches = afterDiCui.match(/\b(?:ALMENO\s+)?\d{1,3}\s*(?:CFU|CREDITI|CREDITO)?\s*(?:TRA|FRA)\s*:?/gi);

  return Boolean(blockMatches && blockMatches.length >= 1);
}

function inferBlockLabel(cfuRichiesti: number, settori: string[]): string {
  const joined = settori.join(", ");

  if (settori.some((settore) => settore.startsWith("M-FIL/") || settore === "M-FIL") && settori.some((settore) => settore.startsWith("M-STO/"))) {
    return `${cfuRichiesti} CFU area filosofica / storico-filosofica`;
  }

  if (settori.every((settore) => settore.startsWith("M-FIL/") || settore.startsWith("M-STO/"))) {
    return `${cfuRichiesti} CFU area filosofica / storico-filosofica`;
  }

  if (settori.every((settore) => settore.startsWith("M-PED/"))) {
    return `${cfuRichiesti} CFU area pedagogica`;
  }

  if (settori.every((settore) => settore.startsWith("M-PSI/"))) {
    return `${cfuRichiesti} CFU area psicologica`;
  }

  if (settori.every((settore) => settore.startsWith("SPS/"))) {
    return `${cfuRichiesti} CFU area sociologica`;
  }

  return `${cfuRichiesti} CFU tra ${joined}`;
}

function splitStructuredBlocksText(text: string): string[] {
  const normalized = normalizeNote(text);

  const matches = Array.from(
    normalized.matchAll(/\b(?:almeno\s+)?\d{1,3}\s*(?:CFU|crediti|credito)?\s*(?:tra|fra)\s*:?/gi)
  );

  if (!matches.length) return [];

  const blocks: string[] = [];

  for (let index = 0; index < matches.length; index += 1) {
    const start = matches[index].index ?? 0;
    const end = index + 1 < matches.length ? matches[index + 1].index ?? normalized.length : normalized.length;
    const block = cleanFragment(normalized.slice(start, end));

    if (block) blocks.push(block);
  }

  return blocks;
}

function parseStructuredDiCuiBlocks(cleanNote: string, requisiti: RequisitoCfu[]): boolean {
  if (!hasStructuredDiCuiBlocks(cleanNote)) return false;

  const afterDiCui = cleanNote.split(/\bdi\s+cui\b/i).slice(1).join(" ");
  const blocks = splitStructuredBlocksText(afterDiCui);

  let parsedAny = false;

  for (const block of blocks) {
    const match = block.match(/\b(?:almeno\s+)?(\d{1,3})\s*(?:CFU|crediti|credito)?\s*(?:tra|fra)\s*:?\s*([\s\S]*)$/i);

    if (!match) continue;

    const cfuRichiesti = Number(match[1]);
    const fragment = cleanFragment(match[2] || "");
    const settori = extractSectors(fragment).filter((settore) => settore.includes("/"));

    if (!cfuRichiesti || settori.length === 0) continue;

    const label = inferBlockLabel(cfuRichiesti, settori);

    const requirement = createRequirement(
      requisiti,
      cfuRichiesti,
      settori,
      cleanNote,
      label
    );

    if (requirement) {
      requisiti.push(requirement);
      parsedAny = true;
    }
  }

  return parsedAny;
}

function parseExplicitCfuRequirements(cleanNote: string, requisiti: RequisitoCfu[], nonInterpretati: string[]) {
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

    addRequirementOrSplitBySector({
      requisiti,
      cfuRichiesti,
      settori,
      fonte: cleanNote,
      rawFragment: fragment,
      rawMatch: cleanFragment(match[0]),
    });
  }
}

function parseCompactRequirementsWithoutCfuWord(cleanNote: string, requisiti: RequisitoCfu[]) {
  const regex =
    /(?:di\s+cui\s+|e\s+|,\s*)?(?:almeno\s+)?(\d{1,3})\s*(?:nei\s+SSD|nei\s+settori|nel\s+settore|in|tra|fra)?\s*((?:[A-Z]+(?:-[A-Z]+)?(?:-[A-Z]+)?\/\d{1,2}|[A-Z]+(?:-[A-Z]+)?(?:-[A-Z]+)?)(?:\s*(?:,|e|o|oppure|\/)\s*(?:[A-Z]+(?:-[A-Z]+)?(?:-[A-Z]+)?\/)?\d{1,2}|(?:\s*(?:,|e|o|oppure)\s*[A-Z]+(?:-[A-Z]+)?(?:-[A-Z]+)?\/\d{1,2})|\s*(?:,|e|o|oppure)\s*[A-Z]+(?:-[A-Z]+)?(?:-[A-Z]+)?){0,12})/gi;

  let match: RegExpExecArray | null;

  while ((match = regex.exec(cleanNote)) !== null) {
    const cfuRichiesti = Number(match[1]);
    const fragment = cleanFragment(match[2] || "");
    const settori = extractSectors(fragment);

    if (!cfuRichiesti || settori.length === 0) continue;

    addRequirementOrSplitBySector({
      requisiti,
      cfuRichiesti,
      settori,
      fonte: cleanNote,
      rawFragment: fragment,
      rawMatch: cleanFragment(match[0]),
    });
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

  if (!cleanNote || !/(CFU|crediti|credito|\d{1,3}\s+[A-Z]+(?:-[A-Z]+)?\/?\d{1,2})/i.test(cleanNote)) {
    return { requisiti: [], nonInterpretati: [] };
  }

  const requisiti: RequisitoCfu[] = [];
  const nonInterpretati: string[] = [];

  const parsedStructuredBlocks = parseStructuredDiCuiBlocks(cleanNote, requisiti);

  if (!parsedStructuredBlocks) {
    parseExplicitCfuRequirements(cleanNote, requisiti, nonInterpretati);
    parseCompactRequirementsWithoutCfuWord(cleanNote, requisiti);
  }

  const deduplicati = removeDuplicateRequirements(removeOverBroadRequirements(requisiti));

  if (deduplicati.length === 0) {
    nonInterpretati.push(cleanNote);
  }

  return {
    requisiti: deduplicati,
    nonInterpretati,
  };
}