"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  BookOpenCheck,
  CheckCircle2,
  Camera,
  Download,
  GraduationCap,
  Mail,
  MessageCircle,
  Plus,
  Trash2,
  AlertTriangle,
  UploadCloud,
  FileText,
  Loader2,
} from "lucide-react";
import AppButton from "@/components/ui/AppButton";
import AppCard from "@/components/ui/AppCard";
import type { ClasseConcorso, EsameCfu, RisultatoVerificaCfu, TitoloCompleto } from "@/lib/classi-concorso/types";
import { createEmptyExam, verificaCfuClasse } from "@/lib/classi-concorso/verificaCfu";
import { normalizeSSD } from "@/lib/classi-concorso/ssd";

type ApiEstrazioneResponse = {
  success: boolean;
  message?: string;
  esami?: EsameCfu[];
  warnings?: string[];
  rawCount?: number;
};

const STORAGE_KEY = "ls_verifica_cfu_per_tutti_v1";
const MAX_FILES = 5;
const MAX_FILE_SIZE = 4 * 1024 * 1024;
const MAX_AI_FILES = 30;
const MAX_PDF_PAGES_PER_FILE = 15;
const PDF_RENDER_SCALE = 2.4;
const ALLOWED_MIME = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
const ORIENTATORE_EMAIL = "info@laureasmart.it";
const WHATSAPP_NUMBER = "393793673257";
const APP_DOWNLOAD_URL = "https://laureasmart.it/download";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Buongiorno, vorrei una verifica gratuita e senza impegno dei CFU per le classi di concorso."
);

function normalizeTemporalText(value: string): string {
  return (value || "")
    .replace(/[’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function hasDateBasedTemporalCondition(note?: string): boolean {
  if (!note) return false;

  const clean = normalizeTemporalText(note);

  const hasExactDate =
    /\d{1,2}[/-]\d{1,2}[/-]\d{4}/.test(clean) ||
    /\d{1,2}\s+(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)\s+\d{4}/i.test(
      clean
    );

  if (!hasExactDate) return false;

  return /\b(entro|fino\s+al|non\s+oltre|prima\s+del|dal|dall'|a\s+decorrere\s+dal|a\s+partire\s+dal|successivamente\s+al|dopo\s+il)\b/i.test(
    clean
  );
}

function formatDateForDisplay(value: string): string {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

const livelli = [
  { value: "triennale", label: "Triennale" },
  { value: "magistrale", label: "Magistrale" },
  { value: "ciclo_unico", label: "Ciclo unico" },
  { value: "altro", label: "Altro / non specificato" },
] as const;

type PreparedAiFiles = {
  files: File[];
  warnings: string[];
};

type DocumentoCaricato = {
  nome: string;
  url: string;
  size: number;
  type: string;
};

type UploadDocumentiResult = {
  documenti: DocumentoCaricato[];
  warnings: string[];
};

type UploadDocumentoResponse = {
  success: boolean;
  message?: string;
  documento?: DocumentoCaricato;
};

async function uploadDocumentiOriginaliToBlob(documenti: File[]): Promise<UploadDocumentiResult> {
  const uploaded: DocumentoCaricato[] = [];
  const warnings: string[] = [];

  for (let index = 0; index < documenti.length; index += 1) {
    const file = documenti[index];

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/verifica-cfu/carica-documento", {
        method: "POST",
        body: formData,
      });

      const json = (await response.json()) as UploadDocumentoResponse;

      if (!response.ok || !json.success || !json.documento?.url) {
        throw new Error(json.message || `${file.name}: caricamento documento non riuscito.`);
      }

      uploaded.push(json.documento);
    } catch (error) {
      console.error("BLOB_UPLOAD_DOCUMENTO_ERROR", error);

      warnings.push(
        error instanceof Error
          ? `${file.name || `Documento ${index + 1}`}: ${error.message}`
          : `${file.name || `Documento ${index + 1}`}: caricamento su storage non riuscito.`
      );
    }
  }

  return { documenti: uploaded, warnings };
}


type PdfJsViewport = {
  width: number;
  height: number;
};

type PdfJsPage = {
  getViewport: (params: { scale: number }) => PdfJsViewport;
  render: (params: {
    canvasContext: CanvasRenderingContext2D;
    viewport: PdfJsViewport;
  }) => { promise: Promise<void> };
};

type PdfJsDocument = {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PdfJsPage>;
};

type PdfJsLib = {
  GlobalWorkerOptions: {
    workerSrc: string;
  };
  getDocument: (params: { data: Uint8Array }) => {
    promise: Promise<PdfJsDocument>;
  };
};

declare global {
  interface Window {
    pdfjsLib?: PdfJsLib;
  }
}

function loadPdfJsFromCdn(): Promise<PdfJsLib> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("PDF.js può essere caricato solo nel browser."));
      return;
    }

    if (window.pdfjsLib) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      resolve(window.pdfjsLib);
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>('script[data-pdfjs="true"]');

    if (existingScript) {
      existingScript.addEventListener("load", () => {
        if (!window.pdfjsLib) {
          reject(new Error("PDF.js non disponibile dopo il caricamento."));
          return;
        }

        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

        resolve(window.pdfjsLib);
      });

      existingScript.addEventListener("error", () => {
        reject(new Error("Errore durante il caricamento di PDF.js."));
      });

      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;
    script.dataset.pdfjs = "true";

    script.onload = () => {
      if (!window.pdfjsLib) {
        reject(new Error("PDF.js non disponibile dopo il caricamento."));
        return;
      }

      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

      resolve(window.pdfjsLib);
    };

    script.onerror = () => {
      reject(new Error("Errore durante il caricamento di PDF.js."));
    };

    document.head.appendChild(script);
  });
}

function canvasToJpegBlob(canvas: HTMLCanvasElement, quality = 0.92): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Impossibile convertire una pagina PDF in immagine."));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      quality
    );
  });
}

async function convertPdfToPageImages(file: File): Promise<PreparedAiFiles> {
  const warnings: string[] = [];
  const files: File[] = [];

  const pdfjsLib = await loadPdfJsFromCdn();
  const data = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(data) });
  const pdf = await loadingTask.promise;
  const pagesToAnalyze = Math.min(pdf.numPages, MAX_PDF_PAGES_PER_FILE);

  if (pdf.numPages > MAX_PDF_PAGES_PER_FILE) {
    warnings.push(
      `${file.name}: il PDF contiene ${pdf.numPages} pagine. Per contenere tempi e costi sono state preparate le prime ${MAX_PDF_PAGES_PER_FILE}.`
    );
  }

  for (let pageNumber = 1; pageNumber <= pagesToAnalyze; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: PDF_RENDER_SCALE });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      warnings.push(`${file.name}: impossibile preparare la pagina ${pageNumber}.`);
      continue;
    }

    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);

    await page.render({ canvasContext: context, viewport }).promise;

    const blob = await canvasToJpegBlob(canvas);
    const cleanName = file.name.replace(/\.pdf$/i, "");
    files.push(
      new File([blob], `${cleanName}-pagina-${pageNumber}.jpg`, {
        type: "image/jpeg",
        lastModified: Date.now(),
      })
    );
  }

  if (files.length) {
    warnings.push(`${file.name}: preparate ${files.length} pagine come immagini per la lettura AI.`);
  }

  return { files, warnings };
}

async function prepareFilesForAiExtraction(originalFiles: File[]): Promise<PreparedAiFiles> {
  const files: File[] = [];
  const warnings: string[] = [];

  for (const file of originalFiles) {
    if (files.length >= MAX_AI_FILES) {
      warnings.push(`Limite tecnico raggiunto: saranno inviate alla lettura AI al massimo ${MAX_AI_FILES} pagine/immagini.`);
      break;
    }

    if (file.type === "application/pdf") {
      try {
        const converted = await convertPdfToPageImages(file);
        warnings.push(...converted.warnings);

        for (const convertedFile of converted.files) {
          if (files.length >= MAX_AI_FILES) break;
          files.push(convertedFile);
        }

        if (!converted.files.length) {
          warnings.push(`${file.name}: conversione PDF non riuscita. Provo a inviare il PDF originale alla lettura AI.`);
          files.push(file);
        }
      } catch (error) {
        warnings.push(
          `${file.name}: non sono riuscito a preparare le pagine del PDF. Provo a inviare il PDF originale alla lettura AI.`
        );
        files.push(file);
        console.error("PDF_CLIENT_RENDER_ERROR", error);
      }
      continue;
    }

    files.push(file);
  }

  return { files: files.slice(0, MAX_AI_FILES), warnings };
}

function dedupEsamiClient(esami: EsameCfu[]): EsameCfu[] {
  const map = new Map<string, EsameCfu>();

  for (const esame of esami) {
    const nome = String(esame.nome || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");

    const ssd = normalizeSSD(String(esame.ssd || ""));
    const cfu = Number(esame.cfu || 0);

    const key = `${nome}|${ssd}|${cfu}`;

    if (!nome || !ssd || !cfu) {
      map.set(`${key}|${esame.id || Math.random()}`, esame);
      continue;
    }

    const existing = map.get(key);

    if (!existing) {
      map.set(key, {
        ...esame,
        ssd,
        cfu,
      });
      continue;
    }

    const existingScore =
      Number(Boolean(existing.nome)) +
      Number(Boolean(existing.ssd)) +
      Number(Boolean(existing.cfu));

    const currentScore =
      Number(Boolean(esame.nome)) +
      Number(Boolean(esame.ssd)) +
      Number(Boolean(esame.cfu));

    if (currentScore > existingScore) {
      map.set(key, {
        ...esame,
        ssd,
        cfu,
      });
    }
  }

  return Array.from(map.values());
}

export default function VerificaCfuPerTuttiPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const [classi, setClassi] = useState<ClasseConcorso[]>([]);
  const [titoli, setTitoli] = useState<TitoloCompleto[]>([]);
  const [titoloCodice, setTitoloCodice] = useState("");
  const [classeCodice, setClasseCodice] = useState("");
  const [esami, setEsami] = useState<EsameCfu[]>([createEmptyExam()]);
  const [documenti, setDocumenti] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [queryTitolo, setQueryTitolo] = useState("");
  const [queryClasse, setQueryClasse] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadWarnings, setUploadWarnings] = useState<string[]>([]);
  const [sendMessage, setSendMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [noteUtente, setNoteUtente] = useState("");
  const [contatto, setContatto] = useState({ nome: "", email: "", telefono: "" });
  const [dataConseguimentoTitolo, setDataConseguimentoTitolo] = useState("");
  const [risultatoSbloccato, setRisultatoSbloccato] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as {
          titoloCodice?: string;
          classeCodice?: string;
          esami?: EsameCfu[];
          noteUtente?: string;
          contatto?: { nome?: string; email?: string; telefono?: string };
          dataConseguimentoTitolo?: string;
        };

        setTitoloCodice(parsed.titoloCodice || "");
        setClasseCodice(parsed.classeCodice || "");
        setNoteUtente(parsed.noteUtente || "");
        setDataConseguimentoTitolo(parsed.dataConseguimentoTitolo || "");
        if (parsed.esami?.length) setEsami(parsed.esami);
        if (parsed.contatto) {
          setContatto({
            nome: parsed.contatto.nome || "",
            email: parsed.contatto.email || "",
            telefono: parsed.contatto.telefono || "",
          });
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    Promise.all([
      fetch("/data/classi-concorso/classi_concorso.json", { cache: "force-cache" }).then((res) => res.json()),
      fetch("/data/classi-concorso/titoli_completi.json", { cache: "force-cache" }).then((res) => res.json()),
    ])
      .then(([classiData, titoliData]) => {
        setClassi(classiData || []);
        setTitoli(titoliData || []);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ titoloCodice, classeCodice, esami, noteUtente, contatto, dataConseguimentoTitolo })
    );
  }, [titoloCodice, classeCodice, esami, noteUtente, contatto, dataConseguimentoTitolo]);

  useEffect(() => {
    setRisultatoSbloccato(false);
    setSendMessage("");
  }, [titoloCodice, classeCodice, esami, dataConseguimentoTitolo]);

  const titoloSelezionato = useMemo(
    () => titoli.find((titolo) => titolo.codice === titoloCodice) || null,
    [titoli, titoloCodice]
  );

  const classeSelezionata = useMemo(
    () => classi.find((classe) => classe.codice === classeCodice) || null,
    [classi, classeCodice]
  );

  const titoliCompatibiliSelezionati = useMemo(() => {
    if (!classeSelezionata || !titoloSelezionato) return [];

    return classeSelezionata.titoli.filter(
      (item) => item.codice.trim().toUpperCase() === titoloSelezionato.codice.trim().toUpperCase()
    );
  }, [classeSelezionata, titoloSelezionato]);

  const richiedeDataConseguimento = useMemo(
    () => titoliCompatibiliSelezionati.some((item) => hasDateBasedTemporalCondition(item.note)),
    [titoliCompatibiliSelezionati]
  );

  const titoliFiltrati = useMemo(() => {
    const q = queryTitolo.trim().toLowerCase();
    return titoli
      .filter((titolo) =>
        !q ||
        titolo.codice.toLowerCase().includes(q) ||
        titolo.titolo.toLowerCase().includes(q)
      )
      .slice(0, 220);
  }, [titoli, queryTitolo]);

  const classiCompatibiliConTitolo = useMemo(() => {
    if (!titoloSelezionato) return classi;
    const codici = new Set(titoloSelezionato.classi.map((item) => item.codice));
    return classi.filter((classe) => codici.has(classe.codice));
  }, [classi, titoloSelezionato]);

  const classiFiltrate = useMemo(() => {
    const q = queryClasse.trim().toLowerCase();
    return classiCompatibiliConTitolo
      .filter((classe) =>
        !q ||
        classe.codice.toLowerCase().includes(q) ||
        classe.descrizione.toLowerCase().includes(q)
      )
      .slice(0, 220);
  }, [classiCompatibiliConTitolo, queryClasse]);

  const esamiValidi = useMemo(
    () => esami.filter((esame) => esame.ssd.trim() && Number(esame.cfu) > 0),
    [esami]
  );

  const risultato: RisultatoVerificaCfu | null = useMemo(() => {
    if (!classeSelezionata || !titoloSelezionato) return null;
    return verificaCfuClasse({
      classe: classeSelezionata,
      titolo: titoloSelezionato,
      esami: esamiValidi,
      dataConseguimentoTitolo: richiedeDataConseguimento ? dataConseguimentoTitolo : undefined,
    });
  }, [
    classeSelezionata,
    titoloSelezionato,
    esamiValidi,
    richiedeDataConseguimento,
    dataConseguimentoTitolo,
  ]);

  const updateExam = (id: string, field: keyof EsameCfu, value: string | number) => {
    setEsami((current) =>
      current.map((esame) =>
        esame.id === id
          ? {
              ...esame,
              [field]: field === "cfu" ? Number(value) : value,
            }
          : esame
      )
    );
  };

  const removeExam = (id: string) => {
    setEsami((current) =>
      current.length === 1 ? current : current.filter((esame) => esame.id !== id)
    );
  };

  const addExam = () => setEsami((current) => [...current, createEmptyExam()]);

  const resetAll = () => {
    setTitoloCodice("");
    setClasseCodice("");
    setQueryTitolo("");
    setQueryClasse("");
    setEsami([createEmptyExam()]);
    setDocumenti([]);
    setUploadMessage("");
    setUploadWarnings([]);
    setSendMessage("");
    setNoteUtente("");
    setContatto({ nome: "", email: "", telefono: "" });
    setDataConseguimentoTitolo("");
    setRisultatoSbloccato(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  const addFiles = (files: FileList | null) => {
    setUploadMessage("");
    setUploadWarnings([]);
    if (!files?.length) return;

    const warnings: string[] = [];
    const accepted: File[] = [];

    for (const file of Array.from(files)) {
      if (!ALLOWED_MIME.includes(file.type)) {
        warnings.push(`${file.name}: formato non supportato. Carica PDF, JPG, PNG o WEBP.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        warnings.push(`${file.name}: superiore a 4 MB.`);
        continue;
      }
      accepted.push(file);
    }

    setDocumenti((current) => {
      const merged = [...current, ...accepted].slice(0, MAX_FILES);
      if (current.length + accepted.length > MAX_FILES) {
        warnings.push(`Puoi caricare al massimo ${MAX_FILES} file per richiesta.`);
      }
      return merged;
    });

    setUploadWarnings(warnings);
  };

  const removeFile = (index: number) => {
    setDocumenti((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const estraiEsamiDaDocumenti = async () => {
    setUploadMessage("");
    setUploadWarnings([]);
  
    if (!documenti.length) {
      setUploadMessage("Carica almeno un documento prima di avviare la lettura automatica.");
      return;
    }
  
    setExtracting(true);
  
    try {
      setUploadMessage(
        "Sto preparando i documenti. Se hai caricato un PDF, analizzo le pagine una per una."
      );
  
      const prepared = await prepareFilesForAiExtraction(documenti);
  
      if (!prepared.files.length) {
        throw new Error("Nessun file valido da inviare alla lettura automatica.");
      }
  
      const allWarnings: string[] = [...prepared.warnings];
      const allExtracted: EsameCfu[] = [];
  
      setUploadWarnings(prepared.warnings);
  
      for (let index = 0; index < prepared.files.length; index += 1) {
        const file = prepared.files[index];
  
        setUploadMessage(
          `Sto leggendo ${index + 1} di ${prepared.files.length}: ${file.name}`
        );
  
        const formData = new FormData();
        formData.append("files", file);
  
        const response = await fetch("/api/verifica-cfu/estrai-esami", {
          method: "POST",
          body: formData,
        });
  
        const json = (await response.json()) as ApiEstrazioneResponse;
  
        if (!response.ok || !json.success) {
          allWarnings.push(
            `${file.name}: lettura non riuscita. Puoi continuare con gli altri file o inserire manualmente eventuali esami mancanti.`
          );
          continue;
        }
  
        if (json.esami?.length) {
          allExtracted.push(...json.esami);
        }
  
        if (json.warnings?.length) {
          allWarnings.push(...json.warnings);
        }
      }
  
      if (!allExtracted.length) {
        setUploadMessage(
          "Non siamo riusciti a leggere correttamente gli esami. Puoi provare con un PDF più chiaro, inserire i dati manualmente o inviare comunque i documenti all’orientatore al termine."
        );
        setUploadWarnings(allWarnings);
        return;
      }
  
      const deduped = dedupEsamiClient(allExtracted);
  
      setEsami((current) => {
        const hasOnlyEmpty =
          current.length === 1 &&
          !current[0].nome &&
          !current[0].ssd &&
          !current[0].cfu;
  
        return hasOnlyEmpty ? deduped : dedupEsamiClient([...current, ...deduped]);
      });
  
      setUploadMessage(
        `Abbiamo trovato ${deduped.length} esami. Controlla SSD e CFU prima di procedere.`
      );
      setUploadWarnings(allWarnings);
    } catch (error) {
      setUploadMessage(
        error instanceof Error
          ? `${error.message} Puoi continuare manualmente oppure inviare comunque i documenti all’orientatore al termine.`
          : "Non siamo riusciti a leggere il documento. Puoi continuare manualmente oppure inviarlo comunque all’orientatore."
      );
    } finally {
      setExtracting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (cameraInputRef.current) cameraInputRef.current.value = "";
    }
  };

  const inviaVerificaEmail = async () => {
    setSendMessage("");

    if (!risultato || !titoloSelezionato || !classeSelezionata) {
      setSendMessage("Seleziona titolo e classe prima di inviare la verifica.");
      return;
    }

    const nomePulito = contatto.nome.trim();
    const emailPulita = contatto.email.trim().toLowerCase();
    const telefonoPulito = contatto.telefono.trim();

    const emailValida = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailPulita);

    if (!nomePulito || !emailPulita || !telefonoPulito) {
      setSendMessage("Inserisci nome, email e telefono per richiedere la verifica gratuita.");
      return;
    }

    if (!emailValida) {
      setSendMessage("Inserisci un indirizzo email valido, ad esempio nome@email.it.");
      return;
    }

    if (richiedeDataConseguimento && !dataConseguimentoTitolo) {
      setSendMessage("Inserisci la data di conseguimento del titolo: per questa combinazione i requisiti cambiano in base alla data.");
      return;
    }

    setSending(true);

    try {
      let documentiCaricati: DocumentoCaricato[] = [];
      let uploadBlobWarnings: string[] = [];

      if (documenti.length > 0) {
        setSendMessage("Sto caricando i documenti in modo sicuro. Attendi qualche secondo...");
        const uploadResult = await uploadDocumentiOriginaliToBlob(documenti);
        documentiCaricati = uploadResult.documenti;
        uploadBlobWarnings = uploadResult.warnings;
      }

      const formData = new FormData();

      formData.append("nome", nomePulito);
      formData.append("email", emailPulita);
      formData.append("telefono", telefonoPulito);
      formData.append("titolo", `${titoloSelezionato.codice} — ${titoloSelezionato.titolo}`);
      formData.append("classe", `${classeSelezionata.codice} — ${classeSelezionata.descrizione}`);
      formData.append(
        "note",
        `${noteUtente}

Origine richiesta: landing pubblica verifica CFU per tutti.
${richiedeDataConseguimento && dataConseguimentoTitolo ? `Data conseguimento titolo: ${formatDateForDisplay(dataConseguimentoTitolo)}.` : ""}
Documenti caricati su storage: ${documentiCaricati.length}.
${
  uploadBlobWarnings.length
    ? `Avvisi caricamento documenti: ${uploadBlobWarnings.join(" | ")}`
    : ""
}`.trim()
      );
      formData.append("esami", JSON.stringify(esamiValidi));
      if (dataConseguimentoTitolo) {
        formData.append("dataConseguimentoTitolo", dataConseguimentoTitolo);
      }
      formData.append("risultato", JSON.stringify(risultato));
      formData.append("documentiUrl", JSON.stringify(documentiCaricati));

      setSendMessage("Sto inviando la richiesta all’orientatore...");

      const response = await fetch("/api/verifica-cfu/invia-verifica", {
        method: "POST",
        body: formData,
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.message || "Errore durante l’invio della richiesta.");
      }

      setRisultatoSbloccato(true);
      setSendMessage(
        uploadBlobWarnings.length
          ? "Richiesta inviata correttamente. Alcuni documenti non sono stati caricati su storage, ma l’orientatore riceverà comunque il riepilogo dei CFU. Ora puoi vedere il risultato preliminare."
          : "Richiesta inviata correttamente. Ti abbiamo inviato una copia via email. Ora puoi vedere il risultato preliminare."
      );
    } catch (error) {
      console.error("INVIO_VERIFICA_ERROR", error);

      setSendMessage(
        error instanceof Error
          ? error.message
          : "Errore durante l’invio della richiesta."
      );
    } finally {
      setSending(false);
    }
  };


  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "22px 18px 70px",
        fontFamily: "var(--font-sora), var(--font-geist-sans), Arial",
        maxWidth: 460,
        margin: "0 auto",
        color: "#FFFFFF",
        background:
          "radial-gradient(circle at top, #173E68 0%, #0B1728 34%, #07111F 100%)",
      }}
    >
      <button
        type="button"
        onClick={() => { window.location.href = "https://laureasmart.it"; }}
        style={{
          border: "none",
          background: "rgba(255,255,255,0.10)",
          color: "#FFFFFF",
          borderRadius: 999,
          padding: "10px 13px",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontWeight: 850,
          marginBottom: 16,
          cursor: "pointer",
        }}
      >
        <ArrowLeft size={18} /> Laurea Smart
      </button>

      <section
        style={{
          borderRadius: 30,
          padding: 24,
          marginBottom: 18,
          background:
            "linear-gradient(135deg, rgba(31,111,178,0.98) 0%, rgba(58,160,255,0.90) 58%, rgba(15,118,110,0.92) 100%)",
          boxShadow: "0 22px 54px rgba(0,0,0,0.34)",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 11px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.16)",
            fontSize: 12,
            fontWeight: 950,
            marginBottom: 14,
          }}
        >
          <BookOpenCheck size={15} /> VERIFICA PRELIMINARE
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: 31,
            lineHeight: 1.05,
            fontWeight: 950,
            letterSpacing: "-0.9px",
          }}
        >
          Verifica gratis i tuoi CFU per le classi di concorso
        </h1>

        <p style={{ margin: "13px 0 0", fontSize: 15.5, lineHeight: 1.6, opacity: 0.95 }}>
          Carica il piano di studi, il certificato esami o uno screenshot della tua carriera universitaria. Il sistema legge automaticamente SSD e CFU e prepara un primo controllo dei crediti utili per la classe di concorso desiderata.
        </p>
      </section>

      <ImmediateContactCard />
      <AppDownloadCard />

      {loading ? (
        <AppCard variant="dark" title="Caricamento dati" description="Sto preparando titoli e classi di concorso." />
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          <AppCard
            variant="dark"
            title="Carica il piano di studi"
            description="Puoi caricare più file: carriera triennale, magistrale, screenshot o PDF. La lettura automatica compilerà la tabella, che potrai correggere."
            icon={<UploadCloud size={22} />}
          >
            <div style={{ display: "grid", gap: 10 }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={uploadChoiceButtonStyle}
              >
                <UploadCloud size={24} />
                <span style={{ display: "grid", gap: 3, textAlign: "left" }}>
                  <strong>Carica documento</strong>
                  <span style={{ color: "rgba(255,255,255,0.70)", fontSize: 12.5 }}>
                    PDF, JPG, PNG o WEBP. I PDF vengono letti pagina per pagina.
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                style={uploadChoiceButtonStyle}
              >
                <Camera size={24} />
                <span style={{ display: "grid", gap: 3, textAlign: "left" }}>
                  <strong>Scatta una foto</strong>
                  <span style={{ color: "rgba(255,255,255,0.70)", fontSize: 12.5 }}>
                    Usa la fotocamera del telefono per fotografare piano di studi o certificato.
                  </span>
                </span>
              </button>

              <span style={{ color: "rgba(255,255,255,0.62)", fontSize: 12.5, lineHeight: 1.45 }}>
                Puoi caricare massimo {MAX_FILES} documenti, 4 MB per file. Dopo il caricamento potrai avviare la lettura automatica.
              </span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
              onChange={(e) => addFiles(e.target.files)}
              style={{ display: "none" }}
            />

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => addFiles(e.target.files)}
              style={{ display: "none" }}
            />

            {documenti.length > 0 && (
              <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
                {documenti.map((file, index) => (
                  <div key={`${file.name}-${index}`} style={fileRowStyle}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                      <FileText size={16} />
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</span>
                    </span>
                    <button type="button" onClick={() => removeFile(index)} style={miniButtonStyle}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "grid", gap: 9, marginTop: 12 }}>
              <AppButton type="button" variant="secondary" onClick={estraiEsamiDaDocumenti} disabled={extracting || !documenti.length}>
                {extracting ? <Loader2 size={18} /> : <UploadCloud size={18} />}
                {extracting ? "Lettura in corso..." : "Leggi automaticamente gli esami"}
              </AppButton>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.68)", fontSize: 12.5, lineHeight: 1.5 }}>
                Il documento sarà utilizzato esclusivamente per estrarre gli esami e calcolare una verifica preliminare dei CFU. Il risultato automatico non ha valore ufficiale e deve essere confermato da un orientatore.
              </p>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.68)", fontSize: 12.5, lineHeight: 1.5 }}>
                Se richiedi la verifica gratuita, il documento caricato, i dati inseriti e il risultato potranno essere inviati a un orientatore Laurea Smart per il controllo del piano di studi.
              </p>
            </div>

            {uploadMessage && <StatusBox>{uploadMessage}</StatusBox>}
            {uploadWarnings.length > 0 && <WarningList items={uploadWarnings} />}
          </AppCard>

          <AppCard
            variant="dark"
            title="1. Titolo di studio"
            description="Cerca il codice o il nome del titolo dichiarato. Esempio: LM-51, LS 6, diploma, psicologia."
            icon={<GraduationCap size={22} />}
          >
            <input
              value={queryTitolo}
              onChange={(e) => setQueryTitolo(e.target.value)}
              placeholder="Cerca titolo di studio..."
              style={inputStyle}
            />

            <select
              value={titoloCodice}
              onChange={(e) => {
                setTitoloCodice(e.target.value);
                setClasseCodice("");
              }}
              style={{ ...inputStyle, marginTop: 10 }}
            >
              <option value="">Seleziona titolo</option>
              {titoliFiltrati.map((titolo) => (
                <option key={titolo.codice} value={titolo.codice}>
                  {titolo.codice} — {titolo.titolo}
                </option>
              ))}
            </select>
          </AppCard>

          <AppCard
            variant="dark"
            title="2. Esami, SSD e CFU"
            description="Controlla gli esami letti dal documento oppure aggiungili manualmente. Il codice SSD viene normalizzato automaticamente."
            icon={<Plus size={22} />}
          >
            <div style={{ display: "grid", gap: 12 }}>
              {esami.map((esame, index) => (
                <div key={esame.id} style={examCardStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <strong>Esame {index + 1}</strong>
                    <button
                      type="button"
                      onClick={() => removeExam(esame.id)}
                      disabled={esami.length === 1}
                      style={{ ...miniButtonStyle, opacity: esami.length === 1 ? 0.4 : 1 }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <input
                    value={esame.nome}
                    onChange={(e) => updateExam(esame.id, "nome", e.target.value)}
                    placeholder="Nome esame"
                    style={inputStyle}
                  />

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 90px", gap: 8, marginTop: 8 }}>
                    <input
                      value={esame.ssd}
                      onChange={(e) => updateExam(esame.id, "ssd", e.target.value)}
                      onBlur={(e) => updateExam(esame.id, "ssd", normalizeSSD(e.target.value))}
                      placeholder="SSD es. MAT/05"
                      style={inputStyle}
                    />
                    <input
                      value={esame.cfu || ""}
                      onChange={(e) => updateExam(esame.id, "cfu", e.target.value)}
                      type="number"
                      min={0}
                      placeholder="CFU"
                      style={inputStyle}
                    />
                  </div>

                  <select
                    value={esame.livello}
                    onChange={(e) => updateExam(esame.id, "livello", e.target.value)}
                    style={{ ...inputStyle, marginTop: 8 }}
                  >
                    {livelli.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 12 }}>
              <AppButton type="button" variant="secondary" onClick={addExam}>
                <Plus size={18} /> Aggiungi esame
              </AppButton>
            </div>
          </AppCard>

          <AppCard
            variant="dark"
            title="3. Classe di concorso"
            description={
              titoloSelezionato
                ? "L’elenco mostra le classi collegate al titolo selezionato."
                : "Prima scegli un titolo di studio, poi seleziona la classe da verificare."
            }
            icon={<BookOpenCheck size={22} />}
          >
            <input
              value={queryClasse}
              onChange={(e) => setQueryClasse(e.target.value)}
              placeholder="Cerca classe, esempio A-28 o matematica..."
              style={inputStyle}
            />

            <select
              value={classeCodice}
              onChange={(e) => setClasseCodice(e.target.value)}
              style={{ ...inputStyle, marginTop: 10 }}
              disabled={!titoloSelezionato}
            >
              <option value="">Seleziona classe</option>
              {classiFiltrate.map((classe) => (
                <option key={classe.codice} value={classe.codice}>
                  {classe.codice} — {classe.descrizione}
                </option>
              ))}
            </select>
          </AppCard>

          {richiedeDataConseguimento && (
            <AppCard
              variant="dark"
              title="Data conseguimento titolo"
              description="Per questa combinazione titolo/classe i requisiti cambiano in base alla data di conseguimento del titolo."
              icon={<GraduationCap size={22} />}
            >
              <input
                value={dataConseguimentoTitolo}
                onChange={(e) => setDataConseguimentoTitolo(e.target.value)}
                type="date"
                style={inputStyle}
              />
              <p style={{ margin: "10px 0 0", color: "rgba(255,255,255,0.68)", fontSize: 12.5, lineHeight: 1.5 }}>
                Inserisci la data indicata nel certificato di laurea o nella carriera universitaria. Il sistema userà questo dato solo quando la nota ministeriale prevede requisiti diversi prima o dopo una determinata data.
              </p>
            </AppCard>
          )}

          {risultato && classeSelezionata && titoloSelezionato && !risultatoSbloccato && (
            <LeadGateCard
              classe={classeSelezionata}
              titolo={titoloSelezionato}
              contatto={contatto}
              setContatto={setContatto}
              noteUtente={noteUtente}
              setNoteUtente={setNoteUtente}
              onInvia={inviaVerificaEmail}
              sending={sending}
              sendMessage={sendMessage}
              fileCount={documenti.length}
            />
          )}

          {risultato && classeSelezionata && titoloSelezionato && risultatoSbloccato && (
            <RisultatoCard
              risultato={risultato}
              classe={classeSelezionata}
              titolo={titoloSelezionato}
              fileCount={documenti.length}
            />
          )}

          <AppCard variant="dark" title="Nota importante" badge="Orientamento">
            <p style={{ margin: 0, color: "rgba(255,255,255,0.74)" }}>
              Il conteggio è una verifica automatica preliminare basata sui dati inseriti o letti dai documenti. Le note ministeriali e i piani di studio possono contenere condizioni particolari: per questo il risultato va sempre controllato da un orientatore.
            </p>
            <div style={{ marginTop: 12 }}>
              <AppButton type="button" variant="ghost" onClick={resetAll}>
                Ricomincia da capo
              </AppButton>
            </div>
          </AppCard>
        </div>
      )}
    </main>
  );
}

function ImmediateContactCard() {
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;
  const emailHref = `mailto:${ORIENTATORE_EMAIL}?subject=${encodeURIComponent(
    "Verifica gratuita CFU classi di concorso"
  )}&body=${encodeURIComponent(
    "Buongiorno, vorrei una verifica gratuita e senza impegno dei CFU per le classi di concorso."
  )}`;

  return (
    <AppCard
      variant="dark"
      title="Preferisci parlare subito con un orientatore?"
      description="Puoi contattarci gratis e senza impegno anche prima di caricare i documenti. Se vuoi, poi potrai comunque usare il test automatico qui sotto."
      icon={<Mail size={22} />}
    >
      <div style={{ display: "grid", gap: 10 }}>
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" style={whatsappButtonStyle}>
          <MessageCircle size={18} />
          Scrivi su WhatsApp
        </a>

        <a href={emailHref} style={emailButtonStyle}>
          <Mail size={18} />
          Invia una email
        </a>

        <p style={{ margin: 0, color: "rgba(255,255,255,0.66)", fontSize: 12.5, lineHeight: 1.5 }}>
          La consulenza è gratuita. Un orientatore può aiutarti a capire quali documenti caricare e come leggere correttamente SSD, CFU e requisiti della classe di concorso.
        </p>
      </div>
    </AppCard>
  );
}


function AppDownloadCard() {
  return (
    <AppCard
      variant="dark"
      title="Vuoi ritrovare e modificare i tuoi percorsi quando vuoi?"
      description="Scarica l’app Laurea Smart: potrai salvare le verifiche, tornare sui tuoi documenti e continuare a confrontare percorsi, atenei e possibilità senza ripartire da zero."
      icon={<Download size={22} />}
    >
      <div style={{ display: "grid", gap: 10 }}>
        <a href={APP_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer" style={downloadButtonStyle}>
          <Download size={18} />
          Scarica la app Laurea Smart
        </a>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.66)", fontSize: 12.5, lineHeight: 1.5 }}>
          Il test online è gratuito. Con l’app puoi continuare a lavorare sui tuoi percorsi anche in un secondo momento e avere sempre a portata di mano gli strumenti di orientamento.
        </p>
      </div>
    </AppCard>
  );
}

function LeadGateCard({
  classe,
  titolo,
  contatto,
  setContatto,
  noteUtente,
  setNoteUtente,
  onInvia,
  sending,
  sendMessage,
  fileCount,
}: {
  classe: ClasseConcorso;
  titolo: TitoloCompleto;
  contatto: { nome: string; email: string; telefono: string };
  setContatto: React.Dispatch<React.SetStateAction<{ nome: string; email: string; telefono: string }>>;
  noteUtente: string;
  setNoteUtente: (value: string) => void;
  onInvia: () => void;
  sending: boolean;
  sendMessage: string;
  fileCount: number;
}) {
  return (
    <AppCard
      variant="amber"
      title="Il tuo risultato preliminare è pronto"
      badge="Sblocca risultato"
      icon={<Mail size={22} />}
    >
      <div style={{ display: "grid", gap: 12 }}>
        <p style={{ margin: 0, lineHeight: 1.55 }}>
          Abbiamo preparato il controllo sulla base degli esami inseriti e della classe selezionata.
          Per visualizzare il riepilogo dei CFU e ricevere una copia via email, inserisci i tuoi dati.
        </p>

        <div style={ctaBoxStyle}>
          <strong>Verifica gratuita e senza impegno</strong>
          <p style={{ margin: "6px 0 0" }}>
            Dopo l’invio vedrai subito il risultato preliminare. Una copia verrà inviata alla tua email e una all’orientatore Laurea Smart.
            {fileCount > 0
              ? ` I ${fileCount} documenti caricati saranno collegati alla richiesta, se disponibili su storage.`
              : " Puoi inviare anche senza documenti se hai inserito gli esami manualmente."}
          </p>
        </div>

        <InfoRow label="Titolo selezionato" value={`${titolo.codice} — ${titolo.titolo}`} />
        <InfoRow label="Classe selezionata" value={`${classe.codice} — ${classe.descrizione}`} />

        <div style={{ display: "grid", gap: 8 }}>
          <input
            value={contatto.nome}
            onChange={(e) => setContatto((current) => ({ ...current, nome: e.target.value }))}
            placeholder="Nome e cognome"
            style={lightInputStyle}
          />
          <input
            value={contatto.email}
            onChange={(e) => setContatto((current) => ({ ...current, email: e.target.value }))}
            placeholder="Email"
            type="email"
            style={lightInputStyle}
          />
          <input
            value={contatto.telefono}
            onChange={(e) => setContatto((current) => ({ ...current, telefono: e.target.value }))}
            placeholder="Telefono"
            style={lightInputStyle}
          />
          <textarea
            value={noteUtente}
            onChange={(e) => setNoteUtente(e.target.value)}
            placeholder="Note facoltative per l’orientatore"
            style={{ ...lightInputStyle, minHeight: 92, paddingTop: 12, resize: "vertical" }}
          />
        </div>

        <AppButton type="button" variant="whatsapp" onClick={onInvia} disabled={sending}>
          {sending ? <Loader2 size={18} /> : <Mail size={18} />}
          {sending ? "Invio in corso..." : "Mostra risultato e richiedi verifica gratuita"}
        </AppButton>

        {sendMessage && <StatusBox darkText>{sendMessage}</StatusBox>}
      </div>
    </AppCard>
  );
}

function RisultatoCard({
  risultato,
  classe,
  titolo,
  fileCount,
}: {
  risultato: RisultatoVerificaCfu;
  classe: ClasseConcorso;
  titolo: TitoloCompleto;
  fileCount: number;
}) {
  const positive = risultato.stato === "positivo";
  const notCompatible = risultato.stato === "titolo_non_compatibile";

  return (
    <AppCard
      variant={notCompatible ? "red" : positive ? "green" : "amber"}
      title="Risultato preliminare"
      badge={positive ? "OK" : notCompatible ? "Titolo non compatibile" : "Da verificare"}
      icon={positive ? <CheckCircle2 size={22} /> : <AlertTriangle size={22} />}
    >
      <div style={{ display: "grid", gap: 12 }}>
        <StatusBox darkText>
          Richiesta inviata correttamente. Ti abbiamo inviato una copia del riepilogo via email e il risultato resta visibile qui sotto.
        </StatusBox>

        <InfoRow label="Titolo" value={`${titolo.codice} — ${titolo.titolo}`} />
        <InfoRow label="Classe" value={`${classe.codice} — ${classe.descrizione}`} />

        {notCompatible ? (
          <p style={{ margin: 0 }}>
            Il titolo selezionato non risulta tra quelli associati a questa classe di concorso nei dati caricati.
          </p>
        ) : risultato.requisiti.length > 0 ? (
          <div style={{ display: "grid", gap: 10 }}>
            {risultato.requisiti.map((req) => (
              <div key={req.id} style={resultRequirementStyle}>
                <strong style={{ display: "block", marginBottom: 6 }}>{req.label}</strong>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 14 }}>
                  <span>Posseduti: {req.cfuPosseduti} CFU</span>
                  <span>{req.soddisfatto ? "Requisito soddisfatto" : `Mancano ${req.cfuMancanti} CFU`}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ margin: 0 }}>
            Per questa combinazione non sono stati rilevati requisiti CFU automatici nella nota, oppure la nota richiede una lettura manuale.
          </p>
        )}

        {risultato.note && (
          <details>
            <summary style={{ cursor: "pointer", fontWeight: 850 }}>Mostra nota originale</summary>
            <p style={{ margin: "8px 0 0", fontSize: 13.5, lineHeight: 1.55 }}>{risultato.note}</p>
          </details>
        )}

        <div style={ctaBoxStyle}>
          <strong>Controllo preliminare</strong>
          <p style={{ margin: "6px 0 0" }}>
            Il risultato automatico non ha valore ufficiale e deve essere verificato da un orientatore.
            {fileCount > 0
              ? " I documenti caricati sono stati associati alla richiesta quando il caricamento su storage è riuscito."
              : " La richiesta è stata inviata sulla base degli esami inseriti manualmente o letti in precedenza."}
          </p>
        </div>
      </div>
    </AppCard>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.4px", opacity: 0.7, fontWeight: 900 }}>
        {label}
      </div>
      <div style={{ fontWeight: 850, lineHeight: 1.35 }}>{value}</div>
    </div>
  );
}

function StatusBox({ children, darkText = false }: { children: React.ReactNode; darkText?: boolean }) {
  return (
    <div
      style={{
        marginTop: 12,
        borderRadius: 18,
        padding: 12,
        background: darkText ? "rgba(255,255,255,0.62)" : "rgba(255,255,255,0.10)",
        border: darkText ? "1px solid rgba(15,23,42,0.10)" : "1px solid rgba(255,255,255,0.12)",
        color: darkText ? "#102033" : "#FFFFFF",
        fontSize: 13.5,
        lineHeight: 1.45,
      }}
    >
      {children}
    </div>
  );
}

function WarningList({ items }: { items: string[] }) {
  return (
    <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
      {items.map((item, index) => (
        <div key={`${item}-${index}`} style={{ fontSize: 12.5, color: "rgba(255,255,255,0.72)", lineHeight: 1.45 }}>
          • {item}
        </div>
      ))}
    </div>
  );
}

const whatsappButtonStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 48,
  borderRadius: 16,
  border: "1px solid rgba(34,197,94,0.28)",
  background: "linear-gradient(135deg, #16A34A 0%, #22C55E 100%)",
  color: "#FFFFFF",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 9,
  fontSize: 15,
  fontWeight: 900,
  textDecoration: "none",
  boxSizing: "border-box",
  boxShadow: "0 12px 24px rgba(22,163,74,0.24)",
};


const downloadButtonStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 48,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "linear-gradient(135deg, #2563eb, #0f766e)",
  color: "#FFFFFF",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 9,
  fontSize: 15,
  fontWeight: 900,
  textDecoration: "none",
  boxSizing: "border-box",
  boxShadow: "0 12px 24px rgba(37,99,235,0.24)",
};

const emailButtonStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 48,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.16)",
  background: "rgba(255,255,255,0.10)",
  color: "#FFFFFF",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 9,
  fontSize: 15,
  fontWeight: 900,
  textDecoration: "none",
  boxSizing: "border-box",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 48,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.16)",
  background: "rgba(255,255,255,0.94)",
  color: "#102033",
  padding: "0 13px",
  fontSize: 15,
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
};

const lightInputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 48,
  borderRadius: 16,
  border: "1px solid rgba(15,23,42,0.12)",
  background: "rgba(255,255,255,0.92)",
  color: "#102033",
  padding: "0 13px",
  fontSize: 15,
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
};

const miniButtonStyle: React.CSSProperties = {
  border: "none",
  background: "rgba(255,255,255,0.10)",
  color: "#FFFFFF",
  borderRadius: 12,
  width: 36,
  height: 36,
  display: "grid",
  placeItems: "center",
  cursor: "pointer",
};


const uploadChoiceButtonStyle: React.CSSProperties = {
  width: "100%",
  border: "1px dashed rgba(255,255,255,0.28)",
  background: "rgba(255,255,255,0.08)",
  color: "#FFFFFF",
  borderRadius: 22,
  padding: "15px 16px",
  display: "flex",
  alignItems: "center",
  gap: 12,
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: 14.5,
};

const fileRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  borderRadius: 16,
  padding: "9px 10px",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.10)",
  fontSize: 13.5,
};

const examCardStyle: React.CSSProperties = {
  borderRadius: 22,
  padding: 14,
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.10)",
};

const resultRequirementStyle: React.CSSProperties = {
  borderRadius: 18,
  padding: 13,
  background: "rgba(255,255,255,0.58)",
  border: "1px solid rgba(15,23,42,0.08)",
};

const ctaBoxStyle: React.CSSProperties = {
  borderRadius: 20,
  padding: 14,
  background: "rgba(31,111,178,0.10)",
  border: "1px solid rgba(31,111,178,0.14)",
};




