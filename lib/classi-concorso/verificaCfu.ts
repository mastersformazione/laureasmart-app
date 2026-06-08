import type {
  ClasseConcorso,
  EsameCfu,
  RisultatoVerificaCfu,
  TitoloCompleto,
} from "./types";
import { isSsdInSector, normalizeSSD } from "./ssd";
import { parseRequisitiDaNota } from "./parserNote";
import { selectTitoloByTemporalCondition } from "./condizioniTemporali";

function sameTitleCode(a: string, b: string): boolean {
  return a.trim().toUpperCase() === b.trim().toUpperCase();
}

function sumCfuForSectors(esami: EsameCfu[], settori: string[]): number {
  return esami.reduce((total, esame) => {
    const normalizedSsd = normalizeSSD(esame.ssd);
    const match = settori.some((settore) => isSsdInSector(normalizedSsd, settore));
    return match ? total + Number(esame.cfu || 0) : total;
  }, 0);
}

export function verificaCfuClasse({
  classe,
  titolo,
  esami,
  dataConseguimentoTitolo,
}: {
  classe: ClasseConcorso;
  titolo: TitoloCompleto | null;
  esami: EsameCfu[];
  dataConseguimentoTitolo?: string;
}): RisultatoVerificaCfu {
  const titoliCompatibili = titolo
    ? classe.titoli.filter((item) => sameTitleCode(item.codice, titolo.codice))
    : [];

  const titoloCompatibile = titoliCompatibili.length > 0;

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

  const selected = selectTitoloByTemporalCondition(titoliCompatibili, dataConseguimentoTitolo);

  if (!selected.titolo) {
    return {
      titoloCompatibile: true,
      titoloSelezionato: undefined,
      note: selected.messaggio || "",
      requisiti: [],
      requisitiNonInterpretati: selected.messaggio ? [selected.messaggio] : [],
      stato: "da_verificare",
    };
  }

  const titoloSelezionato = selected.titolo;
  const note = selected.noteDaUsare || titoloSelezionato.note || "";

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
  const haNoteNonInterpretate =
    parsed.nonInterpretati.length > 0 || (!!note && /CFU|crediti|credito/i.test(note) && !haRequisitiCfu);

  return {
    titoloCompatibile: true,
    titoloSelezionato,
    note,
    requisiti,
    requisitiNonInterpretati: parsed.nonInterpretati,
    stato: haMancanze
      ? "parziale"
      : haNoteNonInterpretate
      ? "da_verificare"
      : "positivo",
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