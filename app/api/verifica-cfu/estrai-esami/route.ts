import { NextResponse } from "next/server";
import { normalizzaEsamiEstratti } from "@/lib/classi-concorso/parseEsamiEstratti";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
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

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("Risposta AI non interpretabile come JSON.");
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

    const content: OpenAIContentPart[] = [
      {
        type: "input_text",
        text:
          "Analizza i documenti universitari allegati. Estrai esclusivamente gli esami sostenuti o riconoscibili come esami di carriera. Per ogni esame restituisci nome, SSD, CFU, voto se presente, livello se deducibile e file sorgente se deducibile. Non inventare SSD o CFU: se non sono presenti o sono dubbi, ometti la riga oppure segnala un warning. Rispondi solo con JSON valido conforme allo schema.",
      },
    ];

    for (const file of validFiles) {
      const arrayBuffer = await file.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");

      if (file.type === "application/pdf") {
        content.push({
          type: "input_file",
          filename: file.name || "documento.pdf",
          file_data: base64,
        });
      } else {
        content.push({
          type: "input_image",
          image_url: `data:${file.type};base64,${base64}`,
          detail: "high",
        });
        content.push({ type: "input_text", text: `Nome file immagine: ${file.name}` });
      }
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
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
      return NextResponse.json(
        {
          success: false,
          message: "Errore durante la lettura AI del documento.",
          detail: errorText.slice(0, 700),
          warnings,
        },
        { status: 500 }
      );
    }

    const aiPayload = await response.json();
    const outputText = getOutputText(aiPayload);
    const parsed = safeJsonParse(outputText);
    const esami = normalizzaEsamiEstratti(parsed.esami || []);

    return NextResponse.json({
      success: true,
      esami,
      warnings: [...warnings, ...(parsed.warnings || [])],
      rawCount: Array.isArray(parsed.esami) ? parsed.esami.length : 0,
    });
  } catch (error) {
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
