import type { ClasseConcorsoTitolo } from "./types";

type TemporalCondition = {
  type: "before_or_on" | "after_or_on" | "before" | "after";
  date: string;
  raw: string;
};

type SelectTitoloResult = {
  titolo?: ClasseConcorsoTitolo;
  richiedeData: boolean;
  noteDaUsare: string;
  messaggio?: string;
};

const MONTHS: Record<string, string> = {
  gennaio: "01",
  febbraio: "02",
  marzo: "03",
  aprile: "04",
  maggio: "05",
  giugno: "06",
  luglio: "07",
  agosto: "08",
  settembre: "09",
  ottobre: "10",
  novembre: "11",
  dicembre: "12",
};

function normalizeText(value: string): string {
  return (value || "")
    .replace(/[’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeDateInput(value?: string): string | null {
  if (!value) return null;

  const trimmed = value.trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  const numeric = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (numeric) {
    const day = numeric[1].padStart(2, "0");
    const month = numeric[2].padStart(2, "0");
    const year = numeric[3];
    return `${year}-${month}-${day}`;
  }

  return null;
}

function parseItalianDate(raw: string): string | null {
  const clean = normalizeText(raw).toLowerCase();

  const numeric = clean.match(/(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
  if (numeric) {
    const day = numeric[1].padStart(2, "0");
    const month = numeric[2].padStart(2, "0");
    const year = numeric[3];
    return `${year}-${month}-${day}`;
  }

  const literal = clean.match(
    /(\d{1,2})\s+(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)\s+(\d{4})/
  );

  if (literal) {
    const day = literal[1].padStart(2, "0");
    const month = MONTHS[literal[2]];
    const year = literal[3];
    return `${year}-${month}-${day}`;
  }

  return null;
}

function compareDates(a: string, b: string): number {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

function extractTemporalCondition(note: string): TemporalCondition | null {
  const clean = normalizeText(note);
  const lower = clean.toLowerCase();

  const date = parseItalianDate(clean);
  if (!date) return null;

  if (
    /\bentro\b/.test(lower) ||
    /\bfino\s+al\b/.test(lower) ||
    /\bnon\s+oltre\b/.test(lower)
  ) {
    return {
      type: "before_or_on",
      date,
      raw: clean,
    };
  }

  if (/\bprima\s+del\b/.test(lower) || /\bprima\s+dell'/.test(lower)) {
    return {
      type: "before",
      date,
      raw: clean,
    };
  }

  if (
    /\bdall'/.test(lower) ||
    /\bdall'/.test(lower) ||
    /\bdal\b/.test(lower) ||
    /\ba\s+decorrere\s+dal\b/.test(lower) ||
    /\ba\s+partire\s+dal\b/.test(lower)
  ) {
    return {
      type: "after_or_on",
      date,
      raw: clean,
    };
  }

  if (/\bsuccessivamente\s+al\b/.test(lower) || /\bdopo\s+il\b/.test(lower)) {
    return {
      type: "after",
      date,
      raw: clean,
    };
  }

  return null;
}

function conditionMatchesDate(condition: TemporalCondition, date: string): boolean {
  const comparison = compareDates(date, condition.date);

  switch (condition.type) {
    case "before_or_on":
      return comparison <= 0;
    case "before":
      return comparison < 0;
    case "after_or_on":
      return comparison >= 0;
    case "after":
      return comparison > 0;
    default:
      return false;
  }
}

export function hasTemporalCondition(note?: string): boolean {
  if (!note) return false;

  const clean = normalizeText(note);

  const hasDate = Boolean(parseItalianDate(clean));
  if (!hasDate) return false;

  return /\b(entro|fino\s+al|non\s+oltre|prima\s+del|dal|dall'|a\s+decorrere\s+dal|a\s+partire\s+dal|successivamente\s+al|dopo\s+il)\b/i.test(
    clean
  );
}

function splitTemporalSegments(note: string): string[] {
  const clean = normalizeText(note);

  const markers = Array.from(
    clean.matchAll(
      /\b(?:per\s+chi|per\s+coloro|per\s+i\s+candidati|per\s+gli\s+studenti|i\s+candidati|gli\s+studenti)[^.;:]{0,180}?(?:entro|fino\s+al|prima\s+del|dal|dall'|a\s+decorrere\s+dal|a\s+partire\s+dal|successivamente\s+al|dopo\s+il)[^.;:]{0,120}?(?:\d{1,2}[/-]\d{1,2}[/-]\d{4}|\d{1,2}\s+(?:gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)\s+\d{4})/gi
    )
  );

  if (!markers.length) return [clean];

  const segments: string[] = [];

  for (let index = 0; index < markers.length; index += 1) {
    const start = markers[index].index ?? 0;
    const end = index + 1 < markers.length ? markers[index + 1].index ?? clean.length : clean.length;
    const segment = clean.slice(start, end).trim();

    if (segment) segments.push(segment);
  }

  return segments.length ? segments : [clean];
}

export function selectNoteByDate(note: string, dataConseguimentoTitolo?: string): {
  noteDaUsare: string;
  richiedeData: boolean;
  messaggio?: string;
} {
  const clean = normalizeText(note);

  if (!hasTemporalCondition(clean)) {
    return {
      noteDaUsare: clean,
      richiedeData: false,
    };
  }

  const normalizedDate = normalizeDateInput(dataConseguimentoTitolo);

  if (!normalizedDate) {
    return {
      noteDaUsare: "",
      richiedeData: true,
      messaggio:
        "Questa combinazione titolo/classe prevede requisiti diversi in base alla data di conseguimento del titolo. Inserisci la data di conseguimento per ottenere una verifica precisa.",
    };
  }

  const segments = splitTemporalSegments(clean);

  for (const segment of segments) {
    const condition = extractTemporalCondition(segment);
    if (!condition) continue;

    if (conditionMatchesDate(condition, normalizedDate)) {
      return {
        noteDaUsare: segment,
        richiedeData: true,
      };
    }
  }

  const singleCondition = extractTemporalCondition(clean);

  if (singleCondition && conditionMatchesDate(singleCondition, normalizedDate)) {
    return {
      noteDaUsare: clean,
      richiedeData: true,
    };
  }

  return {
    noteDaUsare: "",
    richiedeData: true,
    messaggio:
      "La data di conseguimento indicata non corrisponde in modo chiaro alle condizioni temporali presenti nella nota. È necessaria una verifica manuale.",
  };
}

export function selectTitoloByTemporalCondition(
  candidati: ClasseConcorsoTitolo[],
  dataConseguimentoTitolo?: string
): SelectTitoloResult {
  if (!candidati.length) {
    return {
      titolo: undefined,
      richiedeData: false,
      noteDaUsare: "",
    };
  }

  const temporali = candidati.filter((item) => hasTemporalCondition(item.note || ""));

  if (!temporali.length) {
    const titolo = candidati[0];

    return {
      titolo,
      richiedeData: false,
      noteDaUsare: titolo.note || "",
    };
  }

  const normalizedDate = normalizeDateInput(dataConseguimentoTitolo);

  if (!normalizedDate) {
    return {
      titolo: undefined,
      richiedeData: true,
      noteDaUsare: "",
      messaggio:
        "Questa combinazione titolo/classe prevede requisiti diversi in base alla data di conseguimento del titolo. Inserisci la data di conseguimento per ottenere una verifica precisa.",
    };
  }

  for (const candidato of temporali) {
    const condition = extractTemporalCondition(candidato.note || "");
    if (!condition) continue;

    if (conditionMatchesDate(condition, normalizedDate)) {
      const selectedNote = selectNoteByDate(candidato.note || "", normalizedDate);

      return {
        titolo: candidato,
        richiedeData: true,
        noteDaUsare: selectedNote.noteDaUsare || candidato.note || "",
      };
    }
  }

  /*
    Fallback: se esiste una sola nota temporale che contiene al proprio interno più segmenti,
    proviamo a scegliere il segmento corretto dentro quella nota.
  */
  if (temporali.length === 1) {
    const candidato = temporali[0];
    const selectedNote = selectNoteByDate(candidato.note || "", normalizedDate);

    if (selectedNote.noteDaUsare) {
      return {
        titolo: candidato,
        richiedeData: true,
        noteDaUsare: selectedNote.noteDaUsare,
      };
    }
  }

  return {
    titolo: undefined,
    richiedeData: true,
    noteDaUsare: "",
    messaggio:
      "Non è stato possibile individuare automaticamente la nota corretta in base alla data di conseguimento. È necessaria una verifica manuale.",
  };
}