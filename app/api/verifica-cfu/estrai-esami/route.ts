import { NextResponse } from "next/server";
import { normalizzaEsamiEstratti } from "@/lib/classi-concorso/parseEsamiEstratti";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_PDF_TEXT_CHARS = 120_000;
const ALLOWED_TYPES = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);

type OpenAIContentPart =
  | { type: "input_text"; text: string }
  | { type: "input_image"; image_url: string; detail: "high" | "auto" | "low" }
  | { type: "input_file"; filename: string; file_data: string };

type OpenAITextContent = {
  text?: unknown;
};

type OpenAIOutputItem = {
  content?: OpenAITextContent[];
};

type OpenAIResponsePayload = {
  output_text?: unknown;
  output?: OpenAIOutputItem[];
};

type ParsedAiResponse = {
  esami?: unknown;
  warnings?: unknown;
};

type PdfParseResult = {
  text?: string;
  numpages?: number;
};

type PdfParseFn = (buffer: Buffer) => Promise<PdfParseResult>;

function getOutputText(payload: OpenAIResponsePayload): string {
  if (typeof payload.output_text === "string") return payload.output_text;

  const chunks: string[] = [];

  for (const item of payload.output || []) {
    for (const content of item.content || []) {
      if (typeof content.text === "string") chunks.push(content.text);
    }
  }

  return chunks.join("\n").trim();
}

function safeJsonParse(text: string): ParsedAiResponse {
  try {
    return JSON.parse(text) as ParsedAiResponse;
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]) as ParsedAiResponse;
    throw new Error("Risposta AI non interpretabile come JSON.");
  }
}

function truncateText(value: string, maxChars = MAX_PDF_TEXT_CHARS): string {
  if (value.length <= maxChars) return value;
  return `${value.slice(0, maxChars)}\n\n[TESTO PDF TRONCATO PER LIMITE TECNICO: verificare comunque il file originale allegato.]`;
}

async function extractPdfText(buffer: Buffer): Promise<{ text: string; pages?: number }> {
  try {
    const pdfParseModule = await import("pdf-parse");
    const pdfParse = pdfParseModule.default as PdfParseFn;
    const parsed = await pdfParse(buffer);
    return {
      text: String(parsed.text || "").replace(/\r/g, "\n").replace(/\n{3,}/g, "\n\n").trim(),
      pages: parsed.numpages,
    };
  } catch (error) {
    console.error("PDF_TEXT_EXTRACTION_ERROR", error);
    return { text: "" };
  }
}

function buildPrompt(): string {
  return `Analizza i documenti universitari allegati e/o il testo estratto dai PDF.

Obiettivo: estrarre gli esami universitari utili al conteggio CFU per classi di concorso.

Regole fondamentali:
1. Analizza tutto il contenuto disponibile, non solo la prima pagina.
2. Nei PDF testuali troverai blocchi indicati come "TESTO ESTRATTO DA PDF". Considerali fonte primaria perché contengono il testo di tutte le pagine estratte lato server.
3. In molti certificati lo stesso esame compare due volte: una riga principale in maiuscolo/grassetto e una riga descrittiva più piccola sotto. Se due righe hanno stesso nome, stesso SSD/settore e stessi CFU, restituisci una sola riga.
4. Preferisci la riga principale/completa, soprattutto se contiene esito, data o voto.
5. Non duplicare un esame solo perché il nome è ripetuto in maiuscolo e poi in minuscolo.
6. Estrai solo esami, attività formative o prove con CFU e SSD/settore riconoscibile. Non inventare SSD o CFU.
7. Se un dato è leggibile ma incerto, includilo con confidence bassa. Se manca SSD o CFU, non includere la riga e segnala un warning.
8. Normalizza i settori come MAT/01, M-PSI/07, MED/25, SPS/07, ING-INF/05.
9. Per ogni esame restituisci nome, SSD, CFU, voto se presente, livello se deducibile e file sorgente se deducibile.
10. Rispondi solo con JSON valido conforme allo schema.`;
}

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, message: "OPENAI_API_KEY non configurata sul server." },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const files = formData
      .getAll("files")
      .filter((item): item is File => item instanceof File && item.size > 0)
      .slice(0, MAX_FILES);

    if (!files.length) {
      return NextResponse.json({ success: false, message: "Nessun file ricevuto." }, { status: 400 });
    }

    const warnings: string[] = [];
    const validFiles: File[] = [];

    for (const file of files) {
      if (!ALLOWED_TYPES.has(file.type)) {
        warnings.push(`${file.name}: formato non supportato.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        warnings.push(`${file.name}: file superiore a 10 MB.`);
        continue;
      }
      validFiles.push(file);
    }

    if (!validFiles.length) {
      return NextResponse.json(
        { success: false, message: "Nessun file valido da analizzare.", warnings },
        { status: 400 }
      );
    }

    const content: OpenAIContentPart[] = [
      {
        type: "input_text",
        text: buildPrompt(),
      },
    ];

    let pdfTextFiles = 0;
    let pdfFallbackFiles = 0;

    for (const file of validFiles) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString("base64");

      if (file.type === "application/pdf") {
        const extracted = await extractPdfText(buffer);

        if (extracted.text.length >= 80) {
          pdfTextFiles += 1;
          content.push({
            type: "input_text",
            text: `\n\n--- TESTO ESTRATTO DA PDF: ${file.name || "documento.pdf"} ---\nPagine rilevate: ${extracted.pages || "non specificato"}\n${truncateText(extracted.text)}\n--- FINE TESTO PDF: ${file.name || "documento.pdf"} ---`,
          });
        } else {
          pdfFallbackFiles += 1;
          warnings.push(
            `${file.name}: non è stato possibile estrarre testo dal PDF; provo comunque la lettura AI del file.`
          );
          content.push({
            type: "input_file",
            filename: file.name || "documento.pdf",
            file_data: `data:application/pdf;base64,${base64}`,
          });
        }
      } else {
        content.push({
          type: "input_image",
          image_url: `data:${file.type};base64,${base64}`,
          detail: "high",
        });
        content.push({ type: "input_text", text: `Nome file immagine: ${file.name}` });
      }
    }

    if (pdfTextFiles > 0) {
      warnings.push(
        `PDF testuali analizzati tramite estrazione completa del testo: ${pdfTextFiles}. Controllare comunque la tabella prima del calcolo.`
      );
    }
    if (pdfFallbackFiles > 0) {
      warnings.push(
        `PDF analizzati tramite fallback visuale/file: ${pdfFallbackFiles}. Se mancano righe, caricare screenshot ingranditi delle pagine interessate.`
      );
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        input: [{ role: "user", content }],
        text: {
          format: {
            type: "json_schema",
            name: "estrazione_esami_universitari",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                esami: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                      nome: { type: "string" },
                      ssd: { type: "string" },
                      cfu: { type: "number" },
                      voto: { type: ["string", "null"] },
                      livello: { type: ["string", "null"] },
                      sourceFile: { type: ["string", "null"] },
                      confidence: { type: ["number", "null"] },
                    },
                    required: ["nome", "ssd", "cfu", "voto", "livello", "sourceFile", "confidence"],
                  },
                },
                warnings: {
                  type: "array",
                  items: { type: "string" },
                },
              },
              required: ["esami", "warnings"],
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error("OPENAI_RESPONSE_ERROR", {
        status: response.status,
        statusText: response.statusText,
        errorText,
      });

      return NextResponse.json(
        {
          success: false,
          message: "Errore durante la lettura AI del documento.",
          detail: errorText.slice(0, 1200),
          warnings,
        },
        { status: 500 }
      );
    }

    const aiPayload = (await response.json()) as OpenAIResponsePayload;
    const outputText = getOutputText(aiPayload);
    const parsed = safeJsonParse(outputText);
    const rawEsami = Array.isArray(parsed.esami) ? parsed.esami : [];
    const rawWarnings = Array.isArray(parsed.warnings)
      ? parsed.warnings.filter((warning): warning is string => typeof warning === "string")
      : [];
    const esami = normalizzaEsamiEstratti(rawEsami);

    return NextResponse.json({
      success: true,
      esami,
      warnings: [...warnings, ...rawWarnings],
      rawCount: rawEsami.length,
    });
  } catch (error) {
    console.error("ESTRAI_ESAMI_ROUTE_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Errore imprevisto durante l'estrazione degli esami.",
      },
      { status: 500 }
    );
  }
}
