import type { OrientamentoData, RisultatoOrientamento } from "./types";

function normalizza(value?: string) {
  return (value || "").toLowerCase().trim();
}

export function calcolaRisultatoOrientamento(
  data: OrientamentoData
): RisultatoOrientamento {
  const area = normalizza(data.area);
  const obiettivo = normalizza(data.obiettivo);
  const titolo = normalizza(data.titolo_studio);

  if (area.includes("psicologia")) {
    return {
      tipo: "PSICOLOGIA",
      descrizione:
        "Il tuo profilo mostra un interesse verso l’area psicologica, educativa o relazionale. Potresti valutare percorsi coerenti con il supporto alla persona, i processi cognitivi, il lavoro educativo o l’ambito organizzativo.",
      corsoSuggerito: "Laurea online in area Psicologia",
    };
  }

  if (
    area.includes("educazione") ||
    area.includes("formazione") ||
    obiettivo.includes("insegnare") ||
    obiettivo.includes("scuola")
  ) {
    return {
      tipo: "EDUCAZIONE",
      descrizione:
        "Il tuo profilo è orientato verso educazione, formazione, scuola o servizi alla persona. Potresti valutare percorsi utili per lavorare in ambito educativo, sociale o formativo.",
      corsoSuggerito: "Laurea online in Scienze dell’Educazione",
    };
  }

  if (
    area.includes("economia") ||
    area.includes("management") ||
    area.includes("azienda") ||
    obiettivo.includes("carriera")
  ) {
    return {
      tipo: "ECONOMIA",
      descrizione:
        "Il tuo profilo evidenzia un interesse verso economia, management, organizzazione aziendale o crescita professionale. Potresti valutare percorsi utili per ruoli gestionali, amministrativi o manageriali.",
      corsoSuggerito: "Laurea online in area Economia e Management",
    };
  }

  if (
    area.includes("giurisprudenza") ||
    area.includes("giurid") ||
    area.includes("servizi giuridici") ||
    obiettivo.includes("concorso")
  ) {
    return {
      tipo: "GIURIDICA",
      descrizione:
        "Il tuo profilo è vicino all’area giuridica, amministrativa o concorsuale. Potresti valutare percorsi utili per concorsi, pubblica amministrazione, aziende o professioni legali.",
      corsoSuggerito: "Laurea online in area Giuridica",
    };
  }

  if (
    area.includes("motorie") ||
    area.includes("sport") ||
    area.includes("benessere")
  ) {
    return {
      tipo: "SPORT",
      descrizione:
        "Il tuo profilo mostra interesse per sport, movimento, benessere e attività motorie. Potresti valutare percorsi collegati alle Scienze Motorie o alla gestione dei servizi sportivi.",
      corsoSuggerito: "Laurea online in Scienze Motorie",
    };
  }

  if (
    area.includes("comunicazione") ||
    area.includes("marketing") ||
    area.includes("digitale")
  ) {
    return {
      tipo: "COMUNICAZIONE",
      descrizione:
        "Il tuo profilo è orientato verso comunicazione, marketing, media o digitale. Potresti valutare percorsi coerenti con comunicazione d’impresa, contenuti digitali e strategie multimediali.",
      corsoSuggerito: "Laurea online in area Comunicazione",
    };
  }

  if (
    area.includes("informatica") ||
    area.includes("ingegneria") ||
    area.includes("tecnologia") ||
    area.includes("ai")
  ) {
    return {
      tipo: "TECNOLOGIA",
      descrizione:
        "Il tuo profilo mostra interesse per tecnologia, informatica, innovazione o ingegneria. Potresti valutare percorsi coerenti con competenze digitali, tecniche o progettuali.",
      corsoSuggerito: "Laurea online in area Tecnologia e Ingegneria",
    };
  }

  if (titolo.includes("triennale")) {
    return {
      tipo: "ORIENTAMENTO",
      descrizione:
        "Avendo già una laurea triennale, potresti valutare una laurea magistrale, un master o un percorso specialistico coerente con i tuoi obiettivi professionali.",
      corsoSuggerito: "Percorso universitario specialistico",
    };
  }

  return {
    tipo: "GENERALE",
    descrizione:
      "Il tuo profilo richiede un approfondimento orientativo per individuare il percorso più coerente con titolo di studio, obiettivi, tempo disponibile e prospettive professionali.",
    corsoSuggerito: "Percorso universitario da valutare con un orientatore",
  };
}
