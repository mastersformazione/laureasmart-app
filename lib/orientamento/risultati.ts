import type {
  OrientamentoData,
  PercorsoConsigliatoOrientamento,
  RisultatoOrientamento,
} from "./types";

function normalizza(value?: string) {
  return (value || "").toLowerCase().trim();
}

function motivoLaureaOnline(data: OrientamentoData) {
  const situazione = normalizza(data.situazione);
  const tempo = normalizza(data.tempo);
  const obiettivo = normalizza(data.obiettivo);
  const motivazione = normalizza(data.motivazione_studio);

  const segnaliFlessibilita = [
    situazione.includes("lavor"),
    situazione.includes("famiglia"),
    situazione.includes("occupato"),
    tempo.includes("poco"),
    tempo.includes("2"),
    tempo.includes("4"),
    obiettivo.includes("lavoro"),
    obiettivo.includes("carriera"),
    motivazione.includes("tempo"),
    motivazione.includes("famiglia"),
    motivazione.includes("organizzazione"),
  ].some(Boolean);

  if (segnaliFlessibilita) {
    return "In base alle tue risposte, un percorso di laurea online può essere particolarmente adatto perché ti permette di organizzare lo studio con maggiore flessibilità, soprattutto se lavori, hai poco tempo o devi conciliare studio, famiglia e altri impegni.";
  }

  return "In base alle tue risposte, un percorso di laurea online può essere una soluzione utile da valutare perché consente di seguire le lezioni con maggiore autonomia, mantenendo comunque un percorso universitario strutturato.";
}

function creaRispostaFinale(params: {
  introduzione: string;
  percorsi: PercorsoConsigliatoOrientamento[];
  motivoOnline: string;
}) {
  const elencoPercorsi = params.percorsi
    .map((percorso) => `- ${percorso.classe} ${percorso.nome}`)
    .join("\n");

  return `${params.introduzione}
  
  Percorsi che potresti valutare:
  
  ${elencoPercorsi}
  
  ${params.motivoOnline}
  
  La scelta finale andrebbe comunque confermata con un orientatore, soprattutto per verificare requisiti di accesso, riconoscimento CFU, obiettivi professionali e compatibilità con il tuo titolo di studio.`;
}

export function calcolaRisultatoOrientamento(
  data: OrientamentoData
): RisultatoOrientamento {
  const area = normalizza(data.area);
  const obiettivo = normalizza(data.obiettivo);
  const titolo = normalizza(data.titolo_studio);
  const motivazione = normalizza(data.motivazione_studio);

  const motivoOnline = motivoLaureaOnline(data);

  if (
    area.includes("psicologia") ||
    area.includes("sociale") ||
    area.includes("educazione") ||
    area.includes("persona") ||
    motivazione.includes("aiutare") ||
    obiettivo.includes("sociale")
  ) {
    const percorsi: PercorsoConsigliatoOrientamento[] = [
      {
        classe: "L-19",
        nome: "Scienze dell’Educazione e della Formazione",
        area: "Educazione e sociale",
        motivo:
          "È indicata per chi vuole lavorare o crescere in ambito educativo, sociale, formativo e nei servizi alla persona.",
        priorita: "alta",
      },
      {
        classe: "L-24",
        nome: "Scienze e Tecniche Psicologiche",
        area: "Psicologia",
        motivo:
          "È indicata per chi è interessato ai processi psicologici, relazionali, educativi e organizzativi.",
        priorita: "alta",
      },
    ];

    const introduzione =
      "Il tuo profilo mostra una propensione verso l’area sociale, educativa e psicologica. Questo significa che potresti trovarti bene in percorsi legati alla relazione d’aiuto, alla formazione, alla crescita della persona e ai servizi educativi.";

    return {
      tipo: "SOCIALE_PSICO_EDUCATIVO",
      descrizione: introduzione,
      corsoSuggerito: "Lauree online in area Educazione e Psicologia",
      percorsiConsigliati: percorsi,
      modalitaPreferibile: "online",
      motivoModalitaOnline: motivoOnline,
      testoRispostaFinale: creaRispostaFinale({
        introduzione,
        percorsi,
        motivoOnline,
      }),
    };
  }

  if (
    area.includes("psicologia") ||
    area.includes("relazioni") ||
    area.includes("comportamento")
  ) {
    const percorsi: PercorsoConsigliatoOrientamento[] = [
      {
        classe: "L-24",
        nome: "Scienze e Tecniche Psicologiche",
        area: "Psicologia",
        motivo:
          "È il percorso più coerente per chi vuole approfondire comportamento, processi mentali, sviluppo, lavoro e relazioni.",
        priorita: "alta",
      },
      {
        classe: "L-19",
        nome: "Scienze dell’Educazione e della Formazione",
        area: "Educazione",
        motivo:
          "Può essere utile se l’interesse psicologico si collega anche ad ambiti educativi, scolastici o sociali.",
        priorita: "media",
      },
    ];

    const introduzione =
      "Il tuo profilo mostra un interesse prevalente per l’area psicologica, relazionale e comportamentale. Potresti valutare un percorso universitario che ti permetta di comprendere meglio la persona, i contesti educativi, sociali e organizzativi.";

    return {
      tipo: "PSICOLOGIA",
      descrizione: introduzione,
      corsoSuggerito: "Laurea online in Scienze e Tecniche Psicologiche",
      percorsiConsigliati: percorsi,
      modalitaPreferibile: "online",
      motivoModalitaOnline: motivoOnline,
      testoRispostaFinale: creaRispostaFinale({
        introduzione,
        percorsi,
        motivoOnline,
      }),
    };
  }

  if (
    area.includes("educazione") ||
    area.includes("formazione") ||
    obiettivo.includes("insegnare") ||
    obiettivo.includes("scuola") ||
    obiettivo.includes("educatore")
  ) {
    const percorsi: PercorsoConsigliatoOrientamento[] = [
      {
        classe: "L-19",
        nome: "Scienze dell’Educazione e della Formazione",
        area: "Educazione",
        motivo:
          "È il percorso più diretto per chi vuole operare in ambito educativo, formativo, sociale o nei servizi per l’infanzia e la comunità.",
        priorita: "alta",
      },
      {
        classe: "LM-85",
        nome: "Scienze Pedagogiche",
        area: "Pedagogia",
        motivo:
          "Può essere valutata da chi possiede già una laurea triennale coerente e vuole proseguire verso un profilo pedagogico più avanzato.",
        priorita: titolo.includes("triennale") ? "alta" : "media",
      },
    ];

    const introduzione =
      "Il tuo profilo è orientato verso educazione, formazione, scuola o servizi alla persona. Potresti trovarti bene in percorsi che preparano a lavorare nei contesti educativi, sociali e formativi.";

    return {
      tipo: "EDUCAZIONE",
      descrizione: introduzione,
      corsoSuggerito: "Laurea online in Scienze dell’Educazione",
      percorsiConsigliati: percorsi,
      modalitaPreferibile: "online",
      motivoModalitaOnline: motivoOnline,
      testoRispostaFinale: creaRispostaFinale({
        introduzione,
        percorsi,
        motivoOnline,
      }),
    };
  }

  if (
    area.includes("economia") ||
    area.includes("management") ||
    area.includes("azienda") ||
    area.includes("amministrazione") ||
    obiettivo.includes("carriera") ||
    obiettivo.includes("stipendio")
  ) {
    const percorsi: PercorsoConsigliatoOrientamento[] = [
      {
        classe: "L-18",
        nome: "Scienze dell’Economia e della Gestione Aziendale",
        area: "Economia e management",
        motivo:
          "È indicata per chi vuole sviluppare competenze aziendali, gestionali, amministrative e manageriali.",
        priorita: "alta",
      },
      {
        classe: "L-33",
        nome: "Scienze Economiche",
        area: "Economia",
        motivo:
          "È utile per chi vuole approfondire economia, analisi dei mercati, finanza, dati e sistemi economici.",
        priorita: "media",
      },
      {
        classe: "LM-77",
        nome: "Scienze Economico-Aziendali",
        area: "Management",
        motivo:
          "Può essere valutata da chi ha già una laurea triennale e vuole rafforzare il profilo manageriale.",
        priorita: titolo.includes("triennale") ? "alta" : "media",
      },
    ];

    const introduzione =
      "Il tuo profilo evidenzia un interesse verso economia, management, organizzazione aziendale o crescita professionale. Potresti valutare percorsi utili per ruoli gestionali, amministrativi o manageriali.";

    return {
      tipo: "ECONOMIA",
      descrizione: introduzione,
      corsoSuggerito: "Lauree online in area Economia e Management",
      percorsiConsigliati: percorsi,
      modalitaPreferibile: "online",
      motivoModalitaOnline: motivoOnline,
      testoRispostaFinale: creaRispostaFinale({
        introduzione,
        percorsi,
        motivoOnline,
      }),
    };
  }

  if (
    area.includes("giurisprudenza") ||
    area.includes("giurid") ||
    area.includes("servizi giuridici") ||
    obiettivo.includes("concorso") ||
    obiettivo.includes("pubblica amministrazione")
  ) {
    const percorsi: PercorsoConsigliatoOrientamento[] = [
      {
        classe: "L-14",
        nome: "Scienze dei Servizi Giuridici",
        area: "Giuridica",
        motivo:
          "È indicata per chi cerca un percorso giuridico più orientato ad aziende, pubblica amministrazione, consulenza e concorsi.",
        priorita: "alta",
      },
      {
        classe: "LMG-01",
        nome: "Giurisprudenza",
        area: "Giuridica",
        motivo:
          "È il percorso a ciclo unico più adatto per chi vuole una formazione giuridica completa e professionalizzante.",
        priorita: "media",
      },
      {
        classe: "LM-63",
        nome: "Scienze delle Pubbliche Amministrazioni",
        area: "Pubblica amministrazione",
        motivo:
          "Può essere valutata da chi ha già una laurea e punta a ruoli amministrativi, gestionali o concorsuali nella PA.",
        priorita: titolo.includes("triennale") ? "alta" : "media",
      },
    ];

    const introduzione =
      "Il tuo profilo è vicino all’area giuridica, amministrativa o concorsuale. Potresti valutare percorsi utili per concorsi, pubblica amministrazione, aziende o professioni legali.";

    return {
      tipo: "GIURIDICA",
      descrizione: introduzione,
      corsoSuggerito: "Lauree online in area Giuridica",
      percorsiConsigliati: percorsi,
      modalitaPreferibile: "online",
      motivoModalitaOnline: motivoOnline,
      testoRispostaFinale: creaRispostaFinale({
        introduzione,
        percorsi,
        motivoOnline,
      }),
    };
  }

  if (
    area.includes("motorie") ||
    area.includes("sport") ||
    area.includes("benessere")
  ) {
    const percorsi: PercorsoConsigliatoOrientamento[] = [
      {
        classe: "L-22",
        nome: "Scienze delle Attività Motorie e Sportive",
        area: "Scienze motorie",
        motivo:
          "È indicata per chi è interessato a sport, movimento, benessere, attività motoria e servizi sportivi.",
        priorita: "alta",
      },
      {
        classe: "LM-67",
        nome: "Scienze e Tecniche delle Attività Motorie Preventive e Adattate",
        area: "Scienze motorie",
        motivo:
          "Può essere valutata da chi ha già una triennale coerente e vuole specializzarsi in attività motorie preventive o adattate.",
        priorita: titolo.includes("triennale") ? "alta" : "media",
      },
    ];

    const introduzione =
      "Il tuo profilo mostra interesse per sport, movimento, benessere e attività motorie. Potresti valutare percorsi collegati alle Scienze Motorie o alla gestione dei servizi sportivi.";

    return {
      tipo: "SPORT",
      descrizione: introduzione,
      corsoSuggerito: "Laurea online in Scienze Motorie",
      percorsiConsigliati: percorsi,
      modalitaPreferibile: "online",
      motivoModalitaOnline: motivoOnline,
      testoRispostaFinale: creaRispostaFinale({
        introduzione,
        percorsi,
        motivoOnline,
      }),
    };
  }

  if (
    area.includes("comunicazione") ||
    area.includes("marketing") ||
    area.includes("digitale") ||
    area.includes("media")
  ) {
    const percorsi: PercorsoConsigliatoOrientamento[] = [
      {
        classe: "L-20",
        nome: "Scienze della Comunicazione",
        area: "Comunicazione",
        motivo:
          "È indicata per chi vuole sviluppare competenze in comunicazione, media, marketing, contenuti e strategie digitali.",
        priorita: "alta",
      },
      {
        classe: "LM-59",
        nome: "Scienze della Comunicazione Pubblica, d’Impresa e Pubblicità",
        area: "Comunicazione e marketing",
        motivo:
          "Può essere valutata da chi ha già una laurea triennale e vuole specializzarsi nella comunicazione avanzata.",
        priorita: titolo.includes("triennale") ? "alta" : "media",
      },
    ];

    const introduzione =
      "Il tuo profilo è orientato verso comunicazione, marketing, media o digitale. Potresti valutare percorsi coerenti con comunicazione d’impresa, contenuti digitali e strategie multimediali.";

    return {
      tipo: "COMUNICAZIONE",
      descrizione: introduzione,
      corsoSuggerito: "Lauree online in area Comunicazione",
      percorsiConsigliati: percorsi,
      modalitaPreferibile: "online",
      motivoModalitaOnline: motivoOnline,
      testoRispostaFinale: creaRispostaFinale({
        introduzione,
        percorsi,
        motivoOnline,
      }),
    };
  }

  if (
    area.includes("informatica") ||
    area.includes("ingegneria") ||
    area.includes("tecnologia") ||
    area.includes("ai") ||
    area.includes("digitale")
  ) {
    const percorsi: PercorsoConsigliatoOrientamento[] = [
      {
        classe: "L-8",
        nome: "Ingegneria Informatica",
        area: "Ingegneria e tecnologia",
        motivo:
          "È indicata per chi vuole sviluppare competenze tecniche, digitali, progettuali e informatiche.",
        priorita: "alta",
      },
      {
        classe: "L-31",
        nome: "Informatica",
        area: "Informatica",
        motivo:
          "È utile per chi è interessato a programmazione, dati, software, sistemi informatici e tecnologie digitali.",
        priorita: "media",
      },
      {
        classe: "LM-32",
        nome: "Ingegneria Informatica",
        area: "Ingegneria informatica",
        motivo:
          "Può essere valutata da chi ha già una laurea triennale coerente e vuole proseguire verso competenze specialistiche.",
        priorita: titolo.includes("triennale") ? "alta" : "media",
      },
    ];

    const introduzione =
      "Il tuo profilo mostra interesse per tecnologia, informatica, innovazione o ingegneria. Potresti valutare percorsi coerenti con competenze digitali, tecniche o progettuali.";

    return {
      tipo: "TECNOLOGIA",
      descrizione: introduzione,
      corsoSuggerito: "Lauree online in area Tecnologia e Ingegneria",
      percorsiConsigliati: percorsi,
      modalitaPreferibile: "online",
      motivoModalitaOnline: motivoOnline,
      testoRispostaFinale: creaRispostaFinale({
        introduzione,
        percorsi,
        motivoOnline,
      }),
    };
  }

  if (titolo.includes("triennale")) {
    const percorsi: PercorsoConsigliatoOrientamento[] = [
      {
        classe: "LM",
        nome: "Laurea Magistrale coerente con il tuo percorso triennale",
        area: "Specializzazione",
        motivo:
          "Avendo già una laurea triennale, può essere utile valutare una magistrale coerente con il tuo settore e i tuoi obiettivi professionali.",
        priorita: "alta",
      },
      {
        classe: "Master",
        nome: "Master universitario di primo livello",
        area: "Specializzazione professionale",
        motivo:
          "Può essere utile se cerchi una specializzazione più rapida e collegata al lavoro.",
        priorita: "media",
      },
    ];

    const introduzione =
      "Avendo già una laurea triennale, potresti valutare una laurea magistrale, un master o un percorso specialistico coerente con i tuoi obiettivi professionali.";

    return {
      tipo: "ORIENTAMENTO",
      descrizione: introduzione,
      corsoSuggerito: "Percorso universitario specialistico",
      percorsiConsigliati: percorsi,
      modalitaPreferibile: "online",
      motivoModalitaOnline: motivoOnline,
      testoRispostaFinale: creaRispostaFinale({
        introduzione,
        percorsi,
        motivoOnline,
      }),
    };
  }

  const percorsi: PercorsoConsigliatoOrientamento[] = [
    {
      classe: "L-19",
      nome: "Scienze dell’Educazione e della Formazione",
      area: "Educazione",
      motivo:
        "È un percorso ampio e spendibile in diversi contesti educativi, sociali e formativi.",
      priorita: "media",
    },
    {
      classe: "L-24",
      nome: "Scienze e Tecniche Psicologiche",
      area: "Psicologia",
      motivo:
        "È indicata per chi vuole approfondire persona, comportamento, relazioni e contesti sociali.",
      priorita: "media",
    },
    {
      classe: "L-18",
      nome: "Scienze dell’Economia e della Gestione Aziendale",
      area: "Economia",
      motivo:
        "È utile se cerchi un percorso versatile per azienda, management, amministrazione e crescita professionale.",
      priorita: "media",
    },
  ];

  const introduzione =
    "Il tuo profilo richiede un approfondimento orientativo per individuare il percorso più coerente con titolo di studio, obiettivi, tempo disponibile e prospettive professionali.";

  return {
    tipo: "GENERALE",
    descrizione: introduzione,
    corsoSuggerito: "Percorso universitario da valutare con un orientatore",
    percorsiConsigliati: percorsi,
    modalitaPreferibile: "online",
    motivoModalitaOnline: motivoOnline,
    testoRispostaFinale: creaRispostaFinale({
      introduzione,
      percorsi,
      motivoOnline,
    }),
  };
}
