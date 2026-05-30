import type { LeadScoreInput, LeadScoreResult } from "./types";

export function calcolaLeadScoreOrientamento({
  telefono,
  area,
  aspetto_da_valutare,
  segmenti,
}: LeadScoreInput): LeadScoreResult {
  let score = 20;

  if (telefono) score += 20;
  if (area) score += 10;
  if (aspetto_da_valutare) score += 10;

  if (segmenti.segmento_urgenza === "ALTA") score += 30;
  if (segmenti.segmento_urgenza === "MEDIO_ALTA") score += 20;
  if (segmenti.segmento_urgenza === "MEDIA") score += 10;

  if (segmenti.segmento_intento === "CAMBIO_LAVORO") score += 15;
  if (segmenti.segmento_intento === "CONCORSI") score += 15;
  if (segmenti.segmento_intento === "SCUOLA") score += 10;
  if (segmenti.segmento_intento === "COMPLETAMENTO_PROFILO") score += 10;

  if (segmenti.segmento_studente === "GIA_ISCRITTO") score += 10;

  score = Math.min(score, 100);

  let status: LeadScoreResult["status"] = "nuovo";

  if (score >= 80) {
    status = "caldo";
  } else if (score >= 50) {
    status = "tiepido";
  } else if (score >= 25) {
    status = "freddo";
  }

  return {
    score,
    status,
  };
}
