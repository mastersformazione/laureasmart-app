export type OrientamentoData = {
  stato_iscrizione?: string;
  eta?: string;
  situazione?: string;
  titolo_studio?: string;
  obiettivo?: string;
  motivazione_studio?: string;
  urgenza?: string;
  tempo?: string;
  area?: string;
  aspetto_da_valutare?: string;
};

export type SegmentiOrientamento = {
  segmento_studente: string;
  segmento_intento: string;
  segmento_ingresso: string;
  segmento_urgenza: string;
  segmento_motivazione: string;
  segmento_aspetto: string;
};

export type PercorsoConsigliatoOrientamento = {
  classe: string;
  nome: string;
  area: string;
  motivo: string;
  priorita: "alta" | "media" | "bassa";
};

export type RisultatoOrientamento = {
  tipo: string;
  descrizione: string;
  corsoSuggerito: string;

  percorsiConsigliati: PercorsoConsigliatoOrientamento[];

  modalitaPreferibile: "online" | "valutazione_orientatore";
  motivoModalitaOnline: string;

  testoRispostaFinale: string;
};

export type LeadScoreInput = {
  telefono?: string;
  area?: string;
  aspetto_da_valutare?: string;
  segmenti: SegmentiOrientamento;
};

export type LeadScoreResult = {
  score: number;
  status: "nuovo" | "freddo" | "tiepido" | "caldo";
};
