import { NextResponse } from "next/server";
import { normalizzaEsamiEstratti } from "@/lib/classi-concorso/parseEsamiEstratti";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_BLOCKS_PER_REQUEST = 12;
const PDF_BLOCK_MAX_CHARS = 7_000;

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

async function extractPdfText(buffer: Buffer): Promise<{ text: string; pages?: number }> {
  try {
    const pdfParseModule = await import("pdf-parse");
    const pdfParse = pdfParseModule.default as PdfParseFn;
    const parsed = await pdfParse(buffer);

    return {
      text: String(parsed.text || "")
        .replace(/\r/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim(),
      pages: parsed.numpages,
    };
  } catch (error) {
    console.error("PDF_TEXT_EXTRACTION_ERROR", error);
    return { text: "" };
  }
}

function splitTextIntoBlocks(text: string, maxChars = PDF_BLOCK_MAX_CHARS): string[] {
  const normalized = text.trim();
  if (!normalized) return [];

  const lines = normalized
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const blocks: string[] = [];
  let current = "";

  for (const line of lines) {
    const next = current ? `${current}\n${line}` : line;

    if (next.length > maxChars && current) {
      blocks.push(current);
      current = line;
    } else {
      current = next;
    }
  }

  if (current.trim()) {
    blocks.push(current.trim());
  }

  return blocks.slice(0, MAX_BLOCKS_PER_REQUEST);
}

function buildPrompt(): string {
  return `Analizza il contenuto universitario fornito.

Obiettivo: estrarre gli esami universitari utili al conteggio CFU per classi di concorso.

Regole fondamentali:
1. Analizza tutto il contenuto ricevuto nel blocco.
2. Il testo può essere una parte di un PDF più lungo. Non fermarti alle prime righe: controlla tutto il blocco.
3. In molti certificati lo stesso esame compare due volte: una riga principale in maiuscolo/grassetto e una riga descrittiva più piccola sotto. Se due righe hanno stesso nome, stesso SSD/settore e stessi CFU, restituisci una sola riga.
4. Preferisci la riga principale/completa, soprattutto se contiene esito, data o voto.
5. Non duplicare un esame solo perché il nome è ripetuto in maiuscolo e poi in minuscolo.
6. Estrai solo esami, attività formative o prove con CFU e SSD/settore riconoscibile.
7. Non inventare SSD o CFU.
8. Se un dato è leggibile ma incerto, includilo con confidence bassa.
9. Se manca SSD o CFU, non includere la riga e segnala un warning.
10. Normalizza i settori come MAT/01, M-PSI/07, MED/25, SPS/07, ING-INF/05.
11. Per ogni esame restituisci nome, SSD, CFU, voto se presente, livello se deducibile e file sorgente se deducibile.
12. Rispondi solo con JSON valido conforme allo schema.`;
}

async function callOpenAIForContent(content: OpenAIContentPart[]): Promise<ParsedAiResponse> {
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

    throw new Error("Errore durante la lettura AI del documento.");
  }

  const aiPayload = (await response.json()) as OpenAIResponsePayload;
  const outputText = getOutputText(aiPayload);
  return safeJsonParse(outputText);
}

function collectParsedResult(
  parsed: ParsedAiResponse,
  allEsami: unknown[],
  allWarnings: string[]
): void {
  if (Array.isArray(parsed.esami)) {
    allEsami.push(...parsed.esami);
  }

  if (Array.isArray(parsed.warnings)) {
    allWarnings.push(...parsed.warnings.filter((warning): warning is string => typeof warning === "string"));
  }
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

    const allEsami: unknown[] = [];
    const allWarnings: string[] = [...warnings];

    let pdfTextFiles = 0;
    let pdfFallbackFiles = 0;
    let pdfBlocksProcessed = 0;
    let imageFilesProcessed = 0;

    for (const file of validFiles) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString("base64");

      if (file.type === "application/pdf") {
        const extracted = await extractPdfText(buffer);
        const blocks = splitTextIntoBlocks(extracted.text);

        if (blocks.length) {
          pdfTextFiles += 1;
          pdfBlocksProcessed += blocks.length;

          allWarnings.push(
            `${file.name}: PDF testuale analizzato in ${blocks.length} blocchi. Pagine rilevate: ${
              extracted.pages || "non specificato"
            }.`
          );

          for (let index = 0; index < blocks.length; index += 1) {
            const parsed = await callOpenAIForContent([
              {
                type: "input_text",
                text: `${buildPrompt()}

File sorgente: ${file.name || "documento.pdf"}
Tipo contenuto: testo estratto da PDF
Blocco: ${index + 1} di ${blocks.length}
Pagine rilevate nel PDF: ${extracted.pages || "non specificato"}

--- INIZIO BLOCCO TESTO PDF ---
${blocks[index]}
--- FINE BLOCCO TESTO PDF ---`,
              },
            ]);

            collectParsedResult(parsed, allEsami, allWarnings);
          }

          continue;
        }

        pdfFallbackFiles += 1;
        allWarnings.push(
          `${file.name}: non è stato possibile estrarre testo dal PDF; provo comunque la lettura AI del file.`
        );

        const parsed = await callOpenAIForContent([
          {
            type: "input_text",
            text: `${buildPrompt()}

File sorgente: ${file.name || "documento.pdf"}
Tipo contenuto: PDF allegato come file.`,
          },
          {
            type: "input_file",
            filename: file.name || "documento.pdf",
            file_data: `data:application/pdf;base64,${base64}`,
          },
        ]);

        collectParsedResult(parsed, allEsami, allWarnings);
        continue;
      }

      imageFilesProcessed += 1;

      const parsed = await callOpenAIForContent([
        {
          type: "input_text",
          text: `${buildPrompt()}

Nome file immagine: ${file.name || "immagine"}
Tipo contenuto: immagine/foto/screenshot.`,
        },
        {
          type: "input_image",
          image_url: `data:${file.type};base64,${base64}`,
          detail: "high",
        },
      ]);

      collectParsedResult(parsed, allEsami, allWarnings);
    }

    if (pdfTextFiles > 0) {
      allWarnings.push(
        `PDF testuali analizzati tramite estrazione testo multi-blocco: ${pdfTextFiles}. Blocchi processati: ${pdfBlocksProcessed}.`
      );
    }

    if (pdfFallbackFiles > 0) {
      allWarnings.push(
        `PDF analizzati tramite fallback visuale/file: ${pdfFallbackFiles}. Se mancano righe, caricare screenshot ingranditi delle pagine interessate.`
      );
    }

    if (imageFilesProcessed > 0) {
      allWarnings.push(`Immagini analizzate: ${imageFilesProcessed}.`);
    }

    const esami = normalizzaEsamiEstratti(allEsami);

    return NextResponse.json({
      success: true,
      esami,
      warnings: allWarnings,
      rawCount: allEsami.length,
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