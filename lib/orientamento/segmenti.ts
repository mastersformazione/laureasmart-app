import type { OrientamentoData, SegmentiOrientamento } from "./types";

function normalizza(value?: string) {
  return (value || "").toLowerCase().trim();
}

export function calcolaSegmentiOrientamento(
  data: OrientamentoData
): SegmentiOrientamento {
  const stato = normalizza(data.stato_iscrizione);
  const titolo = normalizza(data.titolo_studio);
  const obiettivo = normalizza(data.obiettivo);
  const motivazione = normalizza(data.motivazione_studio);
  const urgenza = normalizza(data.urgenza);
  const aspetto = normalizza(data.aspetto_da_valutare);

  let segmento_studente = "NON_DEFINITO";

  if (
    stato.includes("sì") ||
    stato.includes("si") ||
    stato.includes("iscritto")
  ) {
    segmento_studente = "GIA_ISCRITTO";
  } else if (stato.includes("no") || stato.includes("non")) {
    segmento_studente = "NON_ISCRITTO";
  }

  let segmento_ingresso = "ALTRO";

  if (titolo.includes("diploma")) {
    segmento_ingresso = "DIPLOMA";
  } else if (titolo.includes("triennale")) {
    segmento_ingresso = "LAUREA_TRIENNALE";
  } else if (titolo.includes("magistrale")) {
    segmento_ingresso = "LAUREA_MAGISTRALE";
  } else if (titolo.includes("vecchio ordinamento")) {
    segmento_ingresso = "LAUREA_VECCHIO_ORDINAMENTO";
  } else if (titolo.includes("master")) {
    segmento_ingresso = "MASTER";
  } else if (titolo.includes("afam")) {
    segmento_ingresso = "AFAM";
  } else if (
    titolo.includes("interrotto") ||
    titolo.includes("interrotta") ||
    titolo.includes("università incompleta")
  ) {
    segmento_ingresso = "UNIVERSITA_INCOMPLETA";
  }

  let segmento_intento = "INDECISO";

  if (
    obiettivo.includes("lavoro") ||
    obiettivo.includes("cambiare") ||
    obiettivo.includes("riqualific")
  ) {
    segmento_intento = "CAMBIO_LAVORO";
  } else if (
    obiettivo.includes("stipendio") ||
    obiettivo.includes("carriera") ||
    obiettivo.includes("crescita professionale")
  ) {
    segmento_intento = "AUMENTO_STIPENDIO";
  } else if (
    obiettivo.includes("concorso") ||
    obiettivo.includes("concorsi") ||
    obiettivo.includes("pubblica amministrazione")
  ) {
    segmento_intento = "CONCORSI";
  } else if (
    obiettivo.includes("insegnare") ||
    obiettivo.includes("scuola") ||
    obiettivo.includes("docente")
  ) {
    segmento_intento = "SCUOLA";
  } else if (
    obiettivo.includes("personale") ||
    obiettivo.includes("soddisfazione") ||
    obiettivo.includes("cultura")
  ) {
    segmento_intento = "CRESCITA_PERSONALE";
  } else if (
    obiettivo.includes("completare") ||
    obiettivo.includes("finire") ||
    obiettivo.includes("terminare")
  ) {
    segmento_intento = "COMPLETAMENTO_PROFILO";
  }

  let segmento_urgenza = "NON_DEFINITA";

  if (
    urgenza.includes("subito") ||
    urgenza.includes("prima possibile") ||
    urgenza.includes("urgente")
  ) {
    segmento_urgenza = "ALTA";
  } else if (
    urgenza.includes("entro") ||
    urgenza.includes("poche settimane") ||
    urgenza.includes("mese")
  ) {
    segmento_urgenza = "MEDIO_ALTA";
  } else if (
    urgenza.includes("valutando") ||
    urgenza.includes("informarmi") ||
    urgenza.includes("capire")
  ) {
    segmento_urgenza = "MEDIA";
  } else if (
    urgenza.includes("curiosità") ||
    urgenza.includes("curiosita") ||
    urgenza.includes("senza fretta")
  ) {
    segmento_urgenza = "BASSA";
  }

  let segmento_motivazione = "NON_DEFINITA";

  if (
    motivazione.includes("lavoro") ||
    motivazione.includes("professionale") ||
    motivazione.includes("carriera")
  ) {
    segmento_motivazione = "LAVORO";
  } else if (
    motivazione.includes("concorso") ||
    motivazione.includes("graduatoria")
  ) {
    segmento_motivazione = "CONCORSI";
  } else if (
    motivazione.includes("famiglia") ||
    motivazione.includes("tempo") ||
    motivazione.includes("organizzazione")
  ) {
    segmento_motivazione = "TEMPO_FAMIGLIA";
  } else if (
    motivazione.includes("personale") ||
    motivazione.includes("soddisfazione")
  ) {
    segmento_motivazione = "CRESCITA_PERSONALE";
  }

  let segmento_aspetto = "NON_DEFINITO";

  if (
    aspetto.includes("costi") ||
    aspetto.includes("retta") ||
    aspetto.includes("prezzo")
  ) {
    segmento_aspetto = "COSTI";
  } else if (
    aspetto.includes("tempo") ||
    aspetto.includes("organizzazione") ||
    aspetto.includes("lavoro")
  ) {
    segmento_aspetto = "TEMPO";
  } else if (
    aspetto.includes("cfu") ||
    aspetto.includes("riconoscimento") ||
    aspetto.includes("esami")
  ) {
    segmento_aspetto = "CFU";
  } else if (
    aspetto.includes("sbocchi") ||
    aspetto.includes("lavorativi") ||
    aspetto.includes("occupazione")
  ) {
    segmento_aspetto = "SBOCCHI";
  }

  return {
    segmento_studente,
    segmento_intento,
    segmento_ingresso,
    segmento_urgenza,
    segmento_motivazione,
    segmento_aspetto,
  };
}
