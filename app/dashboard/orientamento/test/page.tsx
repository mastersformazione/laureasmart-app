"use client";

import { useEffect, useState, type ReactNode } from "react";
import OneSignal from "react-onesignal";
import { trackEvent } from "../../../lib/trackEvent";
import {
  Sparkles,
  GraduationCap,
  Clock,
  Target,
  MessageCircle,
  CheckCircle2,
  ArrowRight,
  Share2,
  CalendarCheck,
  ShieldCheck,
} from "lucide-react";
import Button from "@/components/ui/Button";
import BottomNav from "@/components/ui/BottomNav";

type OrientamentoData = {
  eta?: string;
  situazione?: string;
  titolo_studio?: string;
  obiettivo?: string;
  urgenza?: string;
  tempo?: string;
  area?: string;
};

type StepItem = {
  id: keyof OrientamentoData;
  domanda: string;
  opzioni: string[];
};

type Risultato = {
  tipo: string;
  percorso: string;
  corsoSuggerito: string;
  tempoStimato: string;
  difficolta: string;
  descrizione: string;
  motivazioni: string[];
  prossimoPasso: string;
  ctaSecondaria: string;
};

type Segmenti = {
  segmento_intento: string;
  segmento_ingresso: string;
  segmento_urgenza: string;
};

type Orientatrice = {
  nome: string;
  ruolo: string;
  telefono: string;
  telefonoWhatsapp: string;
  foto: string;
  specializzazioni: string[];
};

export default function OrientamentoPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<OrientamentoData>({});
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  useEffect(() => {
    const giaMostrato = localStorage.getItem("notifica_banner_mostrato");

    if (!giaMostrato) {
      setShowNotificationModal(true);
      localStorage.setItem("notifica_banner_mostrato", "si");
    }
  }, []);

  const handleActivateNotifications = async () => {
    setShowNotificationModal(false);

    const storedUser = localStorage.getItem("gps_user");

    if (!storedUser) return;

    const user = JSON.parse(storedUser) as { email?: string };

    if (!user?.email) return;

    try {
      await OneSignal.Notifications.requestPermission();
      await new Promise((resolve) => setTimeout(resolve, 1800));

      if (OneSignal.Notifications.permission === true) {
        await OneSignal.login(user.email.toLowerCase().trim());
        console.log("OneSignal login dopo consenso OK:", user.email);
      } else {
        console.log("OneSignal: notifiche non concesse");
      }
    } catch (error) {
      console.error("Errore attivazione notifiche:", error);
    }
  };

  const handleSkipNotifications = () => {
    setShowNotificationModal(false);
  };

  const steps: StepItem[] = [
    {
      id: "eta",
      domanda: "Qual è la tua fascia d’età?",
      opzioni: [
        "18-24",
        "25-34",
        "35-44",
        "45-54",
        "55+",
        "Preferisco non indicarlo",
      ],
    },
    {
      id: "situazione",
      domanda: "Cosa fai oggi?",
      opzioni: [
        "Lavoro full-time",
        "Lavoro part-time",
        "Studio",
        "Studio e lavoro",
        "Non lavoro al momento",
        "Altro",
      ],
    },
    {
      id: "titolo_studio",
      domanda: "Qual è il tuo titolo di studio attuale?",
      opzioni: [
        "Diploma",
        "Laurea triennale",
        "Laurea magistrale",
        "Laurea vecchio ordinamento",
        "Master universitario",
        "Diploma accademico di primo livello (AFAM)",
        "Diploma accademico di secondo livello (AFAM)",
        "Diploma conservatorio (vecchio ordinamento)",
        "Diploma accademia di belle arti",
        "Ho iniziato l’università ma non ho terminato",
        "Altro",
      ],
    },
    {
      id: "obiettivo",
      domanda: "Perché vuoi laurearti?",
      opzioni: [
        "Aumentare lo stipendio",
        "Cambiare lavoro",
        "Partecipare a concorsi",
        "Insegnare",
        "Crescita personale",
        "Completare il mio profilo professionale",
        "Non sono sicuro",
      ],
    },
    {
      id: "urgenza",
      domanda: "Entro quanto tempo vuoi realizzare questo obiettivo?",
      opzioni: [
        "Subito / entro 1 mese",
        "Entro 3 mesi",
        "Entro 6 mesi",
        "Entro 12 mesi",
        "Non ho una scadenza precisa",
      ],
    },
    {
      id: "tempo",
      domanda: "Quanto tempo puoi dedicare allo studio?",
      opzioni: [
        "2-4 ore a settimana",
        "5-7 ore a settimana",
        "8-10 ore a settimana",
        "Più di 10 ore a settimana",
        "Non lo so ancora",
      ],
    },
    {
      id: "area",
      domanda: "Quale area ti interessa di più?",
      opzioni: [
        "Economia e management",
        "Psicologia",
        "Scienze dell’educazione",
        "Giurisprudenza / servizi giuridici",
        "Scienze motorie",
        "Comunicazione",
        "Informatica / tecnologia",
        "Scuola e insegnamento",
        "Non so ancora",
      ],
    },
  ];

  const getRisultato = (data: OrientamentoData = formData): Risultato => {
    const situazione = data.situazione || "";
    const titolo = data.titolo_studio || "";
    const obiettivo = data.obiettivo || "";
    const urgenza = data.urgenza || "";
    const tempo = data.tempo || "";
    const area = data.area || "";

    let tipo = "GENERALE";
    let corsoSuggerito = "Percorso universitario online personalizzato";
    let percorso = "Percorso consigliato da definire con un orientatore";
    let descrizione =
      "Le tue risposte indicano che hai bisogno di un orientamento personalizzato per scegliere il percorso universitario più adatto al tuo obiettivo.";
    let tempoStimato = "Da valutare";
    let difficolta = "Sostenibile";
    let prossimoPasso = "Ricevere una valutazione personalizzata";
    let ctaSecondaria = "Verifica se puoi accedere a un percorso agevolato";

    const motivazioni: string[] = [];

    if (situazione.includes("Lavoro")) {
      motivazioni.push(
        "Hai bisogno di un percorso flessibile, compatibile con lavoro e impegni quotidiani."
      );
    }

    if (situazione === "Studio e lavoro") {
      motivazioni.push(
        "Studiare e lavorare richiede un piano realistico: la modalità online può aiutarti a gestire meglio i tempi."
      );
    }

    if (titolo === "Diploma") {
      motivazioni.push(
        "Partendo dal diploma, il primo passo naturale è valutare una laurea triennale online."
      );
    }

    if (titolo === "Laurea triennale") {
      motivazioni.push(
        "Avendo già una laurea triennale, potresti completare il profilo con una magistrale online."
      );
    }

    if (
      titolo.includes("AFAM") ||
      titolo.includes("conservatorio") ||
      titolo.includes("accademia") ||
      titolo === "Ho iniziato l’università ma non ho terminato"
    ) {
      motivazioni.push(
        "Il tuo percorso precedente potrebbe essere valorizzato con una valutazione CFU o un percorso personalizzato."
      );
      prossimoPasso = "Richiedere una valutazione gratuita dei CFU";
      ctaSecondaria = "Verifica subito il percorso agevolato";
    }

    if (urgenza === "Subito / entro 1 mese") {
      motivazioni.push(
        "Hai indicato un obiettivo molto ravvicinato: conviene valutare subito il percorso più rapido e sostenibile."
      );
    }

    if (urgenza === "Entro 3 mesi") {
      motivazioni.push(
        "Hai una finestra temporale breve: è utile chiarire presto titolo di ingresso, area e possibilità di agevolazione."
      );
    }

    if (tempo === "2-4 ore a settimana") {
      tempoStimato = "Percorso graduale";
      difficolta = "Bassa/media, se ben organizzato";
      motivazioni.push(
        "Hai poco tempo: serve un percorso sostenibile, non una scelta affrettata."
      );
    }

    if (tempo === "5-7 ore a settimana") {
      tempoStimato = "Percorso equilibrato";
      difficolta = "Media";
      motivazioni.push(
        "Il tempo indicato permette di costruire un ritmo di studio realistico."
      );
    }

    if (
      tempo === "8-10 ore a settimana" ||
      tempo === "Più di 10 ore a settimana"
    ) {
      tempoStimato = "Percorso potenzialmente più rapido";
      difficolta = "Media, con buona costanza";
      motivazioni.push(
        "Hai una disponibilità di tempo interessante: potresti organizzare un percorso più rapido."
      );
    }

    if (area === "Economia e management") {
      tipo = "ECONOMIA";
      corsoSuggerito = "Laurea online in area Economia e Management";
      percorso = "Percorso consigliato: crescita professionale e aziendale";
      descrizione =
        "Questo percorso è indicato se vuoi migliorare il tuo profilo nel lavoro, crescere in azienda, gestire attività o aprirti nuove opportunità professionali.";
    }

    if (area === "Psicologia") {
      tipo = "PSICOLOGIA";
      corsoSuggerito = "Laurea online in area Psicologia";
      percorso = "Percorso consigliato: persone, relazioni e organizzazioni";
      descrizione =
        "Questo percorso è indicato se ti interessa lavorare con le persone, comprendere comportamenti, dinamiche relazionali, formazione o contesti organizzativi.";
    }

    if (area === "Scienze dell’educazione") {
      tipo = "EDUCAZIONE";
      corsoSuggerito = "Laurea online in Scienze dell’Educazione";
      percorso =
        "Percorso consigliato: educazione, formazione e servizi alla persona";
      descrizione =
        "Questo percorso è adatto se vuoi lavorare in ambito educativo, sociale, formativo o nei servizi rivolti a bambini, ragazzi, famiglie e comunità.";
    }

    if (area === "Giurisprudenza / servizi giuridici") {
      tipo = "GIURIDICA";
      corsoSuggerito = "Laurea online in area Giuridica";
      percorso = "Percorso consigliato: diritto, amministrazione e concorsi";
      descrizione =
        "Questo percorso può essere utile se vuoi rafforzare il tuo profilo in ambito amministrativo, legale, aziendale, pubblico o concorsuale.";
    }

    if (area === "Scienze motorie") {
      tipo = "SPORT";
      corsoSuggerito = "Laurea online in Scienze Motorie";
      percorso = "Percorso consigliato: sport, benessere e attività motoria";
      descrizione =
        "Questo percorso è adatto se vuoi lavorare nel mondo dello sport, del benessere, della preparazione fisica o dell’attività motoria.";
    }

    if (area === "Comunicazione") {
      tipo = "COMUNICAZIONE";
      corsoSuggerito = "Laurea online in Comunicazione";
      percorso = "Percorso consigliato: comunicazione, marketing e digitale";
      descrizione =
        "Questo percorso è indicato se vuoi lavorare nella comunicazione, nel marketing, nei media, nei contenuti digitali o migliorare il tuo profilo creativo.";
    }

    if (area === "Informatica / tecnologia") {
      tipo = "TECNOLOGIA";
      corsoSuggerito = "Laurea online in Informatica o area Tecnologica";
      percorso = "Percorso consigliato: competenze digitali e tecnologia";
      descrizione =
        "Questo percorso è utile se vuoi sviluppare competenze tecniche e digitali, oggi molto richieste nel lavoro e nelle aziende.";
    }

    if (area === "Scuola e insegnamento" || obiettivo === "Insegnare") {
      tipo = "SCUOLA";
      corsoSuggerito = "Percorso online collegato a scuola e insegnamento";
      percorso = "Percorso consigliato: scuola, titoli e graduatorie";
      descrizione =
        "Questo percorso è indicato se vuoi lavorare nella scuola, migliorare il tuo profilo per graduatorie, concorsi o percorsi collegati all’insegnamento.";
    }

    if (obiettivo === "Aumentare lo stipendio") {
      motivazioni.push(
        "Il tuo obiettivo è economico: serve un percorso spendibile e coerente con il mercato del lavoro."
      );
    }

    if (obiettivo === "Cambiare lavoro") {
      motivazioni.push(
        "Vuoi cambiare direzione: la scelta del corso deve essere collegata a sbocchi professionali concreti."
      );
    }

    if (obiettivo === "Partecipare a concorsi") {
      motivazioni.push(
        "Se punti ai concorsi, è importante scegliere un titolo coerente e valutare bene requisiti e spendibilità."
      );
    }

    if (obiettivo === "Crescita personale") {
      motivazioni.push(
        "La crescita personale è importante, ma va collegata anche a un percorso utile e sostenibile."
      );
    }

    if (area === "Non so ancora" || obiettivo === "Non sono sicuro") {
      tipo = "ORIENTAMENTO";
      corsoSuggerito = "Percorso di orientamento universitario";
      percorso = "Percorso consigliato: chiarire la scelta prima di iscriversi";
      descrizione =
        "Le tue risposte indicano che prima di scegliere un corso è utile fare una valutazione guidata. La cosa più importante è evitare una scelta casuale.";
      prossimoPasso = "Parlare con un orientatore prima di scegliere";
      ctaSecondaria = "Ricevi una consulenza orientativa gratuita";
    }

    if (motivazioni.length === 0) {
      motivazioni.push(
        "Il percorso migliore va scelto mettendo insieme titolo di partenza, obiettivo, tempo disponibile e area di interesse."
      );
    }

    return {
      tipo,
      percorso,
      corsoSuggerito,
      tempoStimato,
      difficolta,
      descrizione,
      motivazioni,
      prossimoPasso,
      ctaSecondaria,
    };
  };

  const getSegmenti = (data: OrientamentoData): Segmenti => {
    let segmento_intento = "INDECISO";
    let segmento_ingresso = "ALTRO";
    let segmento_urgenza = "NON_DEFINITA";

    if (data.obiettivo === "Cambiare lavoro")
      segmento_intento = "CAMBIO_LAVORO";
    else if (data.obiettivo === "Aumentare lo stipendio")
      segmento_intento = "AUMENTO_STIPENDIO";
    else if (data.obiettivo === "Partecipare a concorsi")
      segmento_intento = "CONCORSI";
    else if (data.obiettivo === "Insegnare") segmento_intento = "SCUOLA";
    else if (data.obiettivo === "Crescita personale")
      segmento_intento = "CRESCITA_PERSONALE";
    else if (data.obiettivo === "Completare il mio profilo professionale")
      segmento_intento = "COMPLETAMENTO_PROFILO";
    else if (data.obiettivo === "Non sono sicuro")
      segmento_intento = "INDECISO";

    if (data.titolo_studio === "Diploma") segmento_ingresso = "DIPLOMA";
    else if (data.titolo_studio === "Laurea triennale")
      segmento_ingresso = "LAUREA_TRIENNALE";
    else if (data.titolo_studio === "Laurea magistrale")
      segmento_ingresso = "LAUREA_MAGISTRALE";
    else if (data.titolo_studio === "Laurea vecchio ordinamento")
      segmento_ingresso = "LAUREA_VECCHIO_ORDINAMENTO";
    else if (data.titolo_studio === "Master universitario")
      segmento_ingresso = "MASTER";
    else if (
      data.titolo_studio?.includes("AFAM") ||
      data.titolo_studio?.includes("conservatorio") ||
      data.titolo_studio?.includes("accademia")
    )
      segmento_ingresso = "AFAM";
    else if (data.titolo_studio?.includes("università"))
      segmento_ingresso = "UNIVERSITA_INCOMPLETA";

    const urgenza = (data.urgenza || "").trim();

    if (urgenza === "Subito / entro 1 mese") segmento_urgenza = "ALTA";
    else if (urgenza === "Entro 3 mesi") segmento_urgenza = "MEDIO_ALTA";
    else if (urgenza === "Entro 6 mesi") segmento_urgenza = "MEDIA";
    else if (urgenza === "Entro 12 mesi") segmento_urgenza = "BASSA";
    else if (urgenza === "Non ho una scadenza precisa")
      segmento_urgenza = "FREDDA";

    return {
      segmento_intento,
      segmento_ingresso,
      segmento_urgenza,
    };
  };

  const getTempoStudioTag = (tempo?: string): string => {
    const value = (tempo || "").trim();

    if (value === "2-4 ore a settimana") return "POCO_TEMPO";
    if (value === "5-7 ore a settimana") return "TEMPO_MEDIO";
    if (value === "8-10 ore a settimana") return "TEMPO_ALTO";
    if (value === "Più di 10 ore a settimana") return "TEMPO_ALTO";
    if (value === "Non lo so ancora") return "NON_SO";

    return "NON_DEFINITO";
  };

  const getOrientatriceAssegnata = (
    data: OrientamentoData,
    risultato: Risultato
  ): Orientatrice => {
    const specializzazioni = new Set<string>();

    specializzazioni.add("Percorsi eCampus");

    if (
      data.situazione?.includes("Lavoro") ||
      data.situazione === "Studio e lavoro"
    ) {
      specializzazioni.add("Studenti lavoratori");
    }

    if (
      data.titolo_studio?.includes("AFAM") ||
      data.titolo_studio?.includes("conservatorio") ||
      data.titolo_studio?.includes("accademia") ||
      data.titolo_studio === "Ho iniziato l’università ma non ho terminato"
    ) {
      specializzazioni.add("Riconoscimento CFU");
    }

    if (data.obiettivo === "Partecipare a concorsi") {
      specializzazioni.add("Percorsi per concorsi pubblici");
    }

    if (data.obiettivo === "Insegnare" || risultato.tipo === "SCUOLA") {
      specializzazioni.add("Scuola e insegnamento");
    }

    if (data.tempo === "2-4 ore a settimana") {
      specializzazioni.add("Piani di studio sostenibili");
    }

    if (data.eta === "35-44" || data.eta === "45-54" || data.eta === "55+") {
      specializzazioni.add("Ripresa degli studi da adulti");
    }

    if (risultato.tipo === "PSICOLOGIA") {
      specializzazioni.add("Area psicologica");
    }

    if (risultato.tipo === "ECONOMIA") {
      specializzazioni.add("Area economia e management");
    }

    if (risultato.tipo === "EDUCAZIONE") {
      specializzazioni.add("Area educazione e formazione");
    }

    if (risultato.tipo === "GIURIDICA") {
      specializzazioni.add("Area giuridica");
    }

    if (risultato.tipo === "TECNOLOGIA") {
      specializzazioni.add("Area informatica e digitale");
    }

    if (risultato.tipo === "SPORT") {
      specializzazioni.add("Area scienze motorie");
    }

    if (risultato.tipo === "COMUNICAZIONE") {
      specializzazioni.add("Area comunicazione digitale");
    }

    specializzazioni.add("Piani di studio personalizzati");

    return {
      nome: "Giulia C.",
      ruolo: "Orientatrice per il Polo di Studi eCampus",
      telefono: "3298170817",
      telefonoWhatsapp: "393298170817",
      foto: "/giulia-orientatrice.png",
      specializzazioni: Array.from(specializzazioni).slice(0, 4),
    };
  };

  const salvaDati = async (data: OrientamentoData) => {
    const risultato = getRisultato(data);
    const segmenti = getSegmenti(data);
    const tempoStudioTag = getTempoStudioTag(data.tempo);

    const storedUser = localStorage.getItem("gps_user");

    const user = storedUser
      ? (JSON.parse(storedUser) as {
          nome?: string;
          cognome?: string;
          email?: string;
          telefono?: string;
        })
      : null;

    localStorage.setItem("profilo_utente", risultato.tipo);
    localStorage.setItem("ha_fatto_test", "si");
    localStorage.setItem("eta", data.eta || "");
    localStorage.setItem("situazione", data.situazione || "");
    localStorage.setItem("titolo_studio", data.titolo_studio || "");
    localStorage.setItem("obiettivo", data.obiettivo || "");
    localStorage.setItem("urgenza_obiettivo", data.urgenza || "");
    localStorage.setItem("tempo_disponibile", data.tempo || "");
    localStorage.setItem("tempo_studio", tempoStudioTag);
    localStorage.setItem("area_interesse", data.area || "");
    localStorage.setItem("segmento_intento", segmenti.segmento_intento);
    localStorage.setItem("segmento_ingresso", segmenti.segmento_ingresso);
    localStorage.setItem("segmento_urgenza", segmenti.segmento_urgenza);
    localStorage.setItem("orientamento_data", JSON.stringify(data));
    localStorage.setItem("orientamento_risultato", JSON.stringify(risultato));

    void trackEvent({
      event_name: "test_completato",
      event_category: "orientamento",
      metadata: {
        profilo: risultato.tipo,
        corso_suggerito: risultato.corsoSuggerito,
        situazione: data.situazione || "",
        titolo_studio: data.titolo_studio || "",
        obiettivo: data.obiettivo || "",
        urgenza: data.urgenza || "",
        tempo: data.tempo || "",
        area: data.area || "",
      },
    });

    try {
      if (!user?.email) {
        console.log("Email utente mancante");
      } else {
        try {
          if (OneSignal.Notifications.permission === true) {
            await OneSignal.login(user.email.toLowerCase().trim());
            console.log("OneSignal login prima sync tag OK:", user.email);
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        } catch (loginError) {
          console.error("Errore login OneSignal prima sync:", loginError);
        }

        const response = await fetch(
          "https://laureasmart.it/api/sync-onesignal-tags.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              nome: user.nome || "",
              cognome: user.cognome || "",
              telefono: user.telefono || "",
              profilo: risultato.tipo,
              titolo_studio: data.titolo_studio || "",
              obiettivo: data.obiettivo || "",
              area_interesse: data.area || "",
              segmento_intento: segmenti.segmento_intento,
              tempo_studio: tempoStudioTag,
              segmento_urgenza: segmenti.segmento_urgenza,
            }),
          }
        );

        const result = await response.json();
        console.log("SYNC ONESIGNAL SERVER:", result);
      }
    } catch (tagError) {
      console.error("Errore sync OneSignal server:", tagError);
    }

    try {
      await fetch("/api/orientamento/salva", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_email: user?.email || "",
          user_nome: user?.nome || "",
          situazione: data.situazione,
          titolo_studio: data.titolo_studio,
          obiettivo: data.obiettivo,
          urgenza_obiettivo: data.urgenza,
          tempo: data.tempo,
          area: data.area,
          risultato_tipo: risultato.tipo,
          corso_suggerito: risultato.corsoSuggerito,
          segmento_intento: segmenti.segmento_intento,
          segmento_ingresso: segmenti.segmento_ingresso,
          segmento_urgenza: segmenti.segmento_urgenza,
        }),
      });
    } catch (error) {
      console.error("Errore salvataggio orientamento:", error);
    }
  };

  const handleShareApp = async () => {
    const shareData = {
      title: "Laurea Smart",
      text: "Scopri gratuitamente quale percorso universitario è più adatto al tuo profilo.",
      url: "https://app.laureasmart.it",
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert("Link copiato");
      }
    } catch {
      console.log("Condivisione annullata");
    }
  };

  const handleTutorWhatsappClick = async (
    orientatrice: Orientatrice,
    risultato: Risultato
  ) => {
    localStorage.setItem("assigned_tutor_name", orientatrice.nome);
    localStorage.setItem("assigned_tutor_phone", orientatrice.telefono);
    localStorage.setItem("assigned_tutor_click", "si");
    localStorage.setItem("assigned_tutor_click_at", new Date().toISOString());

    await trackEvent({
      event_name: "assigned_tutor_click",
      event_category: "conversione",
      metadata: {
        tutor: orientatrice.nome,
        telefono: orientatrice.telefono,
        profilo: risultato.tipo,
        corso_suggerito: risultato.corsoSuggerito,
      },
    });

    window.dispatchEvent(
      new CustomEvent("assigned_tutor_whatsapp", {
        detail: {
          tutor: orientatrice.nome,
          phone: orientatrice.telefono,
          profilo: risultato.tipo,
          corso_suggerito: risultato.corsoSuggerito,
        },
      })
    );
  };

  const handleSelect = async (value: string) => {
    const currentStep = steps[step];

    const updatedData: OrientamentoData = {
      ...formData,
      [currentStep.id]: value,
    };

    setFormData(updatedData);

    if (step < steps.length - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      await salvaDati(updatedData);
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (step >= steps.length) {
    const risultato = getRisultato();
    const orientatrice = getOrientatriceAssegnata(formData, risultato);

    const whatsappUrl = `https://wa.me/${
      orientatrice.telefonoWhatsapp
    }?text=${encodeURIComponent(
      `Ciao Giulia, ho appena completato il test Laurea Smart e vorrei ricevere il mio piano personalizzato.

Situazione attuale: ${formData.situazione || ""}
Titolo di studio: ${formData.titolo_studio || ""}
Obiettivo: ${formData.obiettivo || ""}
Urgenza obiettivo: ${formData.urgenza || ""}
Tempo disponibile: ${formData.tempo || ""}
Area di interesse: ${formData.area || ""}

Risultato: ${risultato.percorso}
Corso suggerito: ${risultato.corsoSuggerito}`
    )}`;

    return (
      <main
        style={{
          minHeight: "100vh",
          padding: 20,
          paddingBottom: 120,
          maxWidth: 500,
          margin: "0 auto",
          color: "#FFFFFF",
          background:
            "radial-gradient(circle at top, #173E68 0%, #0B1728 34%, #07111F 100%)",
          fontFamily: "var(--font-sora), var(--font-geist-sans), Arial",
        }}
      >
        <ResultHero risultato={risultato} />

        <div style={{ display: "grid", gap: 14, marginTop: 20 }}>
          <ResultMetric
            icon={<GraduationCap size={22} />}
            title="Corso suggerito"
            description={risultato.corsoSuggerito}
          />

          <ResultMetric
            icon={<Clock size={22} />}
            title="Tempo stimato"
            description={risultato.tempoStimato}
          />

          <ResultMetric
            icon={<Target size={22} />}
            title="Difficoltà percepita"
            description={risultato.difficolta}
          />

          <DarkCard title="Perché è adatto al tuo profilo" badge="Motivi">
            <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
              {risultato.motivazioni.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    gap: 10,
                    padding: 12,
                    borderRadius: 18,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.72)",
                    fontSize: 14,
                    lineHeight: 1.5,
                  }}
                >
                  <CheckCircle2
                    size={18}
                    color="#78C2FF"
                    style={{ flexShrink: 0, marginTop: 1 }}
                  />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </DarkCard>

          <DarkCard
            title="Prossimo passo"
            description={risultato.prossimoPasso}
            badge="Gratis"
          />

          <AssignedTutorCard orientatrice={orientatrice} />

          <a
            href={whatsappUrl}
            rel="noopener noreferrer"
            onClick={async (event) => {
              event.preventDefault();

              await handleTutorWhatsappClick(orientatrice, risultato);

              window.location.href = whatsappUrl;
            }}
            style={{
              width: "100%",
              minHeight: 62,
              borderRadius: 22,
              background: "#25D366",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              textDecoration: "none",
              fontWeight: 900,
              fontSize: 16,
              boxShadow: "0 16px 34px rgba(37,211,102,0.30)",
            }}
          >
            <MessageCircle size={22} />
            Parla con Giulia su WhatsApp
            <ArrowRight size={20} />
          </a>

          <button
            type="button"
            onClick={() => {
              localStorage.setItem("prenota_chiamata_giulia", "si");
              window.location.href = `tel:${orientatrice.telefono}`;
            }}
            style={{
              width: "100%",
              minHeight: 62,
              borderRadius: 22,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.08)",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              fontWeight: 900,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            <CalendarCheck size={22} color="#78C2FF" />
            Chiama Giulia
            <ArrowRight size={20} color="#78C2FF" />
          </button>

          <section
            onClick={() => (window.location.href = "/dashboard/percorsi")}
            style={{
              padding: 18,
              borderRadius: 26,
              background:
                "linear-gradient(135deg, #1E90FF 0%, #0066FF 58%, #0047D9 100%)",
              border: "1px solid rgba(255,255,255,0.36)",
              boxShadow:
                "0 18px 42px rgba(0,102,255,0.34), inset 0 0 0 1px rgba(255,255,255,0.10)",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                right: -35,
                bottom: -35,
                width: 120,
                height: 120,
                borderRadius: 999,
                background: "rgba(255,255,255,0.10)",
              }}
            />

            <div
              style={{
                position: "absolute",
                right: 42,
                top: 22,
                color: "rgba(255,255,255,0.85)",
                fontSize: 22,
                fontWeight: 900,
              }}
            >
              ✦
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                position: "relative",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.18)",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)",
                }}
              >
                <GraduationCap size={29} />
              </div>

              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 21,
                    lineHeight: 1.14,
                    fontWeight: 900,
                    color: "#FFFFFF",
                    letterSpacing: "-0.5px",
                  }}
                >
                  Visita tutti i corsi disponibili
                </h3>

                <p
                  style={{
                    margin: "7px 0 0",
                    fontSize: 14,
                    lineHeight: 1.45,
                    color: "rgba(255,255,255,0.90)",
                  }}
                >
                  Esplora lauree, magistrali e master e salva i percorsi che
                  vuoi confrontare.
                </p>
              </div>

              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.95)",
                  color: "#0066FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
                }}
              >
                <ArrowRight size={22} />
              </div>
            </div>
          </section>

          <p
            style={{
              margin: "0 auto",
              fontSize: 13,
              color: "rgba(255,255,255,0.58)",
              lineHeight: 1.5,
              textAlign: "center",
              maxWidth: 360,
            }}
          >
            {risultato.ctaSecondaria}. Un orientatore può aiutarti a capire
            quale percorso online è più adatto al tuo lavoro, al tuo tempo e al
            tuo obiettivo.
          </p>

          <section
            style={{
              marginTop: 20,
              padding: 18,
              borderRadius: 28,
              background:
                "linear-gradient(135deg, rgba(31,111,178,0.22) 0%, rgba(17,32,51,0.94) 100%)",
              border: "1px solid rgba(120,194,255,0.16)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.24)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 13,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 20,
                  background: "rgba(58,160,255,0.16)",
                  color: "#78C2FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Share2 size={27} />
              </div>

              <div>
                <div
                  style={{
                    display: "inline-flex",
                    padding: "6px 10px",
                    borderRadius: 999,
                    background: "rgba(58,160,255,0.16)",
                    color: "#78C2FF",
                    fontSize: 11,
                    fontWeight: 900,
                    marginBottom: 8,
                  }}
                >
                  CONDIVIDI LA APP
                </div>

                <h3
                  style={{
                    margin: 0,
                    fontSize: 22,
                    lineHeight: 1.12,
                    fontWeight: 900,
                    color: "#FFFFFF",
                    letterSpacing: "-0.5px",
                  }}
                >
                  Conosci qualcuno che sta cercando la laurea giusta?
                </h3>

                <p
                  style={{
                    margin: "9px 0 0",
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: "rgba(255,255,255,0.72)",
                  }}
                >
                  Condividi Laurea Smart con amici, colleghi o familiari che
                  vogliono orientarsi gratuitamente senza costi o obblighi.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleShareApp}
              style={{
                width: "100%",
                minHeight: 58,
                borderRadius: 20,
                border: "none",
                background: "#3AA0FF",
                color: "#FFFFFF",
                fontSize: 15,
                fontWeight: 900,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                cursor: "pointer",
                boxShadow: "0 14px 30px rgba(58,160,255,0.24)",
              }}
            >
              <Share2 size={19} />
              Condividi Laurea Smart
            </button>
          </section>
        </div>

        <BottomNav />
      </main>
    );
  }

  const current = steps[step];
  const progress = Math.round(((step + 1) / steps.length) * 100);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 20,
        paddingBottom: 120,
        maxWidth: 500,
        margin: "0 auto",
        color: "#FFFFFF",
        background:
          "radial-gradient(circle at top, #173E68 0%, #0B1728 34%, #07111F 100%)",
        fontFamily: "var(--font-sora), var(--font-geist-sans), Arial",
      }}
    >
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 32,
          padding: 26,
          background:
            "linear-gradient(135deg, #1F6FB2 0%, #3AA0FF 52%, #155487 100%)",
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.36)",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -42,
            top: -42,
            width: 150,
            height: 150,
            borderRadius: 999,
            background: "rgba(255,255,255,0.14)",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 22,
              background: "rgba(255,255,255,0.16)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Sparkles size={30} />
          </div>

          <p
            style={{
              margin: "0 0 8px",
              fontSize: 14,
              fontWeight: 850,
              opacity: 0.92,
            }}
          >
            Test di orientamento
          </p>

          <h1
            style={{
              margin: 0,
              fontSize: 33,
              lineHeight: 1.04,
              fontWeight: 900,
              letterSpacing: "-1px",
            }}
          >
            Trova la laurea giusta per te
          </h1>

          <p
            style={{
              margin: "14px 0 0",
              fontSize: 15,
              lineHeight: 1.6,
              opacity: 0.94,
            }}
          >
            Rispondi a poche domande: ti mostreremo un percorso più coerente con
            titolo, obiettivo e tempo disponibile.
          </p>
        </div>
      </section>

      <DarkCard>
        <div style={{ marginBottom: 18 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              marginBottom: 12,
            }}
          >
            {step > 0 ? (
              <button
                type="button"
                onClick={() => {
                  setStep(step - 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                style={{
                  border: "1px solid rgba(120,194,255,0.22)",
                  background: "rgba(58,160,255,0.12)",
                  color: "#78C2FF",
                  borderRadius: 999,
                  padding: "7px 10px",
                  fontSize: 12,
                  fontWeight: 900,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  whiteSpace: "nowrap",
                }}
              >
                ← Indietro
              </button>
            ) : (
              <span style={{ width: 82 }} />
            )}

            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 900,
                color: "#78C2FF",
                textAlign: "center",
                flex: 1,
              }}
            >
              Domanda {step + 1} di {steps.length}
            </p>

            <span
              style={{
                padding: "6px 10px",
                borderRadius: 999,
                background: "rgba(58,160,255,0.16)",
                color: "#78C2FF",
                fontSize: 12,
                fontWeight: 900,
                whiteSpace: "nowrap",
              }}
            >
              {progress}%
            </span>
          </div>

          <div
            style={{
              width: "100%",
              height: 8,
              borderRadius: 999,
              background: "rgba(255,255,255,0.08)",
              overflow: "hidden",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                borderRadius: 999,
                background: "linear-gradient(90deg, #3AA0FF, #78C2FF)",
              }}
            />
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: 25,
              lineHeight: 1.16,
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: "-0.6px",
            }}
          >
            {current.domanda}
          </h2>
        </div>

        <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
          {current.opzioni.map((opzione) => (
            <button
              key={opzione}
              onClick={() => handleSelect(opzione)}
              style={{
                width: "100%",
                minHeight: 58,
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(255,255,255,0.07)",
                color: "#FFFFFF",
                padding: "14px 15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                textAlign: "left",
                fontSize: 15,
                fontWeight: 850,
                cursor: "pointer",
                boxShadow: "0 10px 24px rgba(0,0,0,0.14)",
              }}
            >
              <span>{opzione}</span>
              <ArrowRight size={18} color="#78C2FF" />
            </button>
          ))}
        </div>
      </DarkCard>

      {showNotificationModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(2,7,18,0.82)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 22,
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 390,
              borderRadius: 32,
              background:
                "linear-gradient(135deg, rgba(17,32,51,0.98) 0%, rgba(11,23,40,0.98) 100%)",
              padding: 26,
              textAlign: "center",
              boxShadow: "0 30px 90px rgba(0,0,0,0.45)",
              border: "1px solid rgba(255,255,255,0.10)",
              color: "#FFFFFF",
            }}
          >
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: 26,
                background: "rgba(58,160,255,0.16)",
                color: "#78C2FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 18px",
                boxShadow: "0 12px 28px rgba(0,0,0,0.22)",
              }}
            >
              <Sparkles size={34} />
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: 28,
                lineHeight: 1.08,
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: "-0.8px",
              }}
            >
              Capisci in pochi secondi qual è il percorso migliore per te
            </h2>

            <p
              style={{
                margin: "14px 0 22px",
                fontSize: 15,
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.68)",
              }}
            >
              Parti da qui: in base alle tue risposte ti mostreremo subito un
              possibile percorso universitario adatto ai tuoi obiettivi.
            </p>

            <div style={{ display: "grid", gap: 10 }}>
              <Button
                label="Inizia"
                variant="primary"
                onClick={handleActivateNotifications}
              />

              <button
                type="button"
                onClick={handleSkipNotifications}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "rgba(255,255,255,0.42)",
                  fontSize: 13,
                  fontWeight: 600,
                  padding: 6,
                  cursor: "pointer",
                }}
              >
                Non ora
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </main>
  );
}

function AssignedTutorCard({ orientatrice }: { orientatrice: Orientatrice }) {
  return (
    <section
      style={{
        padding: 18,
        borderRadius: 28,
        background: "#FFFFFF",
        color: "#101828",
        border: "1px solid rgba(255,255,255,0.16)",
        boxShadow: "0 18px 42px rgba(0,0,0,0.28)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "flex-start",
        }}
      >
        <img
          src={orientatrice.foto}
          alt="Orientatrice Laurea Smart"
          style={{
            width: 104,
            height: 104,
            borderRadius: 999,
            objectFit: "cover",
            flexShrink: 0,
            border: "4px solid #F1ECFF",
          }}
        />

        <div style={{ flex: 1 }}>
          <p
            style={{
              margin: "0 0 6px",
              fontSize: 12,
              fontWeight: 900,
              color: "#6B46C1",
              textTransform: "uppercase",
              letterSpacing: "0.4px",
            }}
          >
            Orientatrice assegnata
          </p>

          <h3
            style={{
              margin: 0,
              fontSize: 25,
              lineHeight: 1.1,
              fontWeight: 950,
              color: "#111827",
            }}
          >
            {orientatrice.nome}
          </h3>

          <p
            style={{
              margin: "6px 0 12px",
              fontSize: 14,
              lineHeight: 1.35,
              color: "#6B46C1",
              fontWeight: 800,
            }}
          >
            {orientatrice.ruolo}
          </p>

          <div
            style={{
              height: 1,
              background: "#E5E7EB",
              marginBottom: 12,
            }}
          />

          <p
            style={{
              margin: "0 0 10px",
              fontSize: 14,
              fontWeight: 850,
              color: "#111827",
            }}
          >
            Specializzata in:
          </p>

          <div style={{ display: "grid", gap: 8 }}>
            {orientatrice.specializzazioni.map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 14,
                  color: "#1F2937",
                  fontWeight: 650,
                }}
              >
                <CheckCircle2 size={17} color="#6B46C1" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 16,
          padding: "12px 14px",
          borderRadius: 18,
          background: "#F7F2FF",
          color: "#374151",
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 14,
          fontWeight: 750,
        }}
      >
        <Clock size={18} color="#6B46C1" />
        Di solito risponde entro pochi minuti.
      </div>

      <div
        style={{
          marginTop: 12,
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          color: "#4B5563",
          fontSize: 13,
          lineHeight: 1.45,
        }}
      >
        <ShieldCheck size={18} color="#6B46C1" style={{ flexShrink: 0 }} />
        <span>
          Il servizio è gratuito e senza impegno. Giulia ti aiuterà a trovare il
          percorso più adatto al tuo profilo.
        </span>
      </div>
    </section>
  );
}

function DarkCard({
  title,
  description,
  badge,
  children,
}: {
  title?: string;
  description?: string;
  badge?: string;
  children?: ReactNode;
}) {
  return (
    <section
      style={{
        padding: 20,
        borderRadius: 28,
        background: "rgba(17,32,51,0.86)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 16px 40px rgba(0,0,0,0.26)",
        backdropFilter: "blur(16px)",
      }}
    >
      {(title || badge) && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          {title && (
            <h2
              style={{
                margin: 0,
                fontSize: 21,
                lineHeight: 1.16,
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: "-0.4px",
              }}
            >
              {title}
            </h2>
          )}

          {badge && (
            <span
              style={{
                borderRadius: 999,
                background: "rgba(58,160,255,0.16)",
                color: "#78C2FF",
                padding: "6px 10px",
                fontSize: 11,
                fontWeight: 900,
                whiteSpace: "nowrap",
              }}
            >
              {badge}
            </span>
          )}
        </div>
      )}

      {description && (
        <p
          style={{
            margin: "10px 0 0",
            fontSize: 14,
            lineHeight: 1.55,
            color: "rgba(255,255,255,0.68)",
          }}
        >
          {description}
        </p>
      )}

      {children}
    </section>
  );
}

function ResultHero({ risultato }: { risultato: Risultato }) {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 32,
        padding: 28,
        background:
          "linear-gradient(135deg, #1F6FB2 0%, #3AA0FF 52%, #155487 100%)",
        border: "1px solid rgba(255,255,255,0.14)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.36)",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -46,
          top: -46,
          width: 160,
          height: 160,
          borderRadius: 999,
          background: "rgba(255,255,255,0.14)",
        }}
      />

      <div
        style={{
          width: 62,
          height: 62,
          borderRadius: 24,
          background: "rgba(255,255,255,0.16)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 18,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Sparkles size={31} />
      </div>

      <p
        style={{
          margin: "0 0 10px",
          fontSize: 14,
          fontWeight: 900,
          opacity: 0.92,
          position: "relative",
          zIndex: 1,
        }}
      >
        Risultato del test
      </p>

      <h1
        style={{
          margin: 0,
          fontSize: 31,
          lineHeight: 1.08,
          fontWeight: 900,
          letterSpacing: "-0.9px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {risultato.percorso}
      </h1>

      <p
        style={{
          margin: "14px 0 0",
          fontSize: 15,
          lineHeight: 1.6,
          opacity: 0.95,
          position: "relative",
          zIndex: 1,
        }}
      >
        {risultato.descrizione}
      </p>
    </section>
  );
}

function ResultMetric({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <section
      style={{
        display: "flex",
        gap: 13,
        padding: 16,
        borderRadius: 24,
        background: "rgba(17,32,51,0.86)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 14px 34px rgba(0,0,0,0.24)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 18,
          background: "rgba(58,160,255,0.16)",
          color: "#78C2FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      <div>
        <h3
          style={{
            margin: 0,
            fontSize: 15,
            fontWeight: 900,
            color: "#FFFFFF",
          }}
        >
          {title}
        </h3>

        <p
          style={{
            margin: "6px 0 0",
            fontSize: 14,
            lineHeight: 1.5,
            color: "rgba(255,255,255,0.66)",
          }}
        >
          {description}
        </p>
      </div>
    </section>
  );
}
