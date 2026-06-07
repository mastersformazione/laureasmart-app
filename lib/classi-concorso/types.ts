export type ClasseConcorsoTitolo = {
  codice: string;
  titolo: string;
  url?: string;
  note?: string;
};

export type ClasseConcorso = {
  codice: string;
  descrizione: string;
  slug?: string;
  titoli: ClasseConcorsoTitolo[];
};

export type TitoloCompletoClasse = {
  codice: string;
  descrizione: string;
  note?: string;
};

export type TitoloCompleto = {
  codice: string;
  titolo: string;
  url?: string;
  classi: TitoloCompletoClasse[];
};

export type EsameCfu = {
  id: string;
  nome: string;
  ssd: string;
  cfu: number;
  livello: "triennale" | "magistrale" | "ciclo_unico" | "altro";
};

export type RequisitoCfu = {
  id: string;
  label: string;
  cfuRichiesti: number;
  settori: string[];
  tipo: "settore" | "area" | "gruppo";
  fonte: string;
};

export type EsitoRequisitoCfu = RequisitoCfu & {
  cfuPosseduti: number;
  cfuMancanti: number;
  soddisfatto: boolean;
};

export type RisultatoVerificaCfu = {
  titoloCompatibile: boolean;
  titoloSelezionato?: ClasseConcorsoTitolo;
  note: string;
  requisiti: EsitoRequisitoCfu[];
  requisitiNonInterpretati: string[];
  stato: "positivo" | "parziale" | "da_verificare" | "titolo_non_compatibile";
};
