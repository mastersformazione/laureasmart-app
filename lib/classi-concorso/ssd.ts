const PREFIX_WITH_DASH = new Set(["MPSI", "MLIN", "MFIL", "MSTO", "MPED", "MGGR", "MDEA"]);

export function normalizeSSD(value: string): string {
  const raw = value.trim().toUpperCase();
  if (!raw) return "";

  const cleaned = raw
    .replace(/\s+/g, "")
    .replace(/_/g, "-")
    .replace(/\\/g, "/");

  const alreadyFormatted = cleaned.match(/^([A-Z]+(?:-[A-Z]+)?)(?:\/|-)?(\d{2})$/);
  if (alreadyFormatted) {
    return `${alreadyFormatted[1]}/${alreadyFormatted[2]}`;
  }

  const compact = cleaned.replace(/[-/]/g, "");
  const compactMatch = compact.match(/^([A-Z]+)(\d{2})$/);

  if (!compactMatch) return cleaned;

  const [, prefix, number] = compactMatch;

  if (PREFIX_WITH_DASH.has(prefix) && prefix.length >= 4) {
    return `${prefix.charAt(0)}-${prefix.slice(1)}/${number}`;
  }

  if (prefix === "INGINF") return `ING-INF/${number}`;
  if (prefix === "INGIND") return `ING-IND/${number}`;
  if (prefix === "INGICAR") return `ICAR/${number}`;
  if (prefix === "SECS") return `SECS/${number}`;

  return `${prefix}/${number}`;
}

export function normalizeArea(value: string): string {
  return value.trim().toUpperCase().replace(/\s+/g, "").replace(/\\/g, "/");
}

export function isSsdInSector(ssd: string, sector: string): boolean {
  const normalizedSsd = normalizeSSD(ssd);
  const normalizedSector = normalizeArea(sector);

  if (!normalizedSsd || !normalizedSector) return false;

  if (/^[A-Z]+(?:-[A-Z]+)?\/\d{2}$/.test(normalizedSector)) {
    return normalizedSsd === normalizedSector;
  }

  return normalizedSsd.startsWith(`${normalizedSector}/`);
}
