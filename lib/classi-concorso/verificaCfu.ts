import type {
  ClasseConcorso,
  EsameCfu,
  RisultatoVerificaCfu,
  TitoloCompleto,
} from "./types";
import { isSsdInSector, normalizeSSD } from "./ssd";
import { parseRequisitiDaNota } from "./parserNote";

function sameTitleCode(a: string, b: string): boolean {
  return a.trim().toUpperCase() === b.trim().toUpperCase();
}

function toSafeCfu(value: unknown): number {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function normalizeExamSsd(ssd: string): string {
  return normalizeSSD(String(ssd || "").trim());
}

function sumCfuForSectors(esami: EsameCfu[], settori: string[]): number {
  const cleanSettori = settori.map((settore) => String(settore || "").trim()).filter(Boolean);

  if (!cleanSettori.length) return 0;

  return esami.reduce((total, esame) => {
    const normalizedSsd = normalizeExamSsd(esame.ssd);
    const cfu = toSafeCfu(esame.cfu);

    if (!normalizedSsd || !cfu) return total;

    const match = cleanSettori.some((settore) => isSsdInSector(normalizedSsd, settore));

    return match ? total + cfu : total;
  }, 0);
}

function hasCfuLanguage(note: string): boolean {
  return /(CFU|crediti|credito|\d{1,3}\s+[A-Z]+(?:-[A-Z]+)?(?:-[A-Z]+)?\/\d{2})/i.test(note || "");
}

export function verificaCfuClasse({
  classe,
  titolo,
  esami,
}: {
  classe: ClasseConcorso;
  titolo: TitoloCompleto | null;
  esami: EsameCfu[];
}): RisultatoVerificaCfu {
  const titoloSelezionato = titolo
    ? classe.titoli.find((item) => sameTitleCode(item.codice, titolo.codice))
    : undefined;

  const titoloCompatibile = Boolean(titoloSelezionato);
  const note = titoloSelezionato?.note || "";

  if (!titoloCompatibile) {
    return {
      titoloCompatibile: false,
      titoloSelezionato: undefined,
      note: "",
      requisiti: [],
      requisitiNonInterpretati: [],
      stato: "titolo_non_compatibile",
    };
  }

  const parsed = parseRequisitiDaNota(note);

  const requisiti = parsed.requisiti.map((requisito) => {
    const cfuPosseduti = sumCfuForSectors(esami, requisito.settori);
    const cfuMancanti = Math.max(0, requisito.cfuRichiesti - cfuPosseduti);

    return {
      ...requisito,
      cfuPosseduti,
      cfuMancanti,
      soddisfatto: cfuMancanti === 0,
    };
  });

  const haRequisitiCfu = requisiti.length > 0;
  const haMancanze = requisiti.some((requisito) => !requisito.soddisfatto);
  const notaSembraRichiedereCfu = hasCfuLanguage(note);
  const haNoteNonInterpretate =
    parsed.nonInterpretati.length > 0 || (notaSembraRichiedereCfu && !haRequisitiCfu);

  let stato: RisultatoVerificaCfu["stato"];

  if (haRequisitiCfu && haMancanze) {
    stato = "parziale";
  } else if (haRequisitiCfu && !haMancanze && haNoteNonInterpretate) {
    stato = "da_verificare";
  } else if (haRequisitiCfu && !haMancanze) {
    stato = "positivo";
  } else if (haNoteNonInterpretate) {
    stato = "da_verificare";
  } else {
    stato = "positivo";
  }

  return {
    titoloCompatibile: true,
    titoloSelezionato,
    note,
    requisiti,
    requisitiNonInterpretati: parsed.nonInterpretati,
    stato,
  };
}

export function createEmptyExam(): EsameCfu {
  return {
    id: `exam-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    nome: "",
    ssd: "",
    cfu: 0,
    livello: "triennale",
  };
}