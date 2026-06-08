import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);

const LAUREA_SMART_EMAIL = "info@laureasmart.it";
const LAUREA_SMART_WHATSAPP = "+39 379 367 3257";
const LAUREA_SMART_WHATSAPP_URL = "https://wa.me/393793673257";
const LAUREA_SMART_SITE = "https://laureasmart.it";

type EsameConfermato = {
  nome?: string;
  ssd?: string;
  cfu?: number | string;
  livello?: string;
};

type RequisitoRisultato = {
  id?: string;
  label?: string;
  cfuPosseduti?: number | string;
  cfuMancanti?: number | string;
  soddisfatto?: boolean;
};

type RisultatoVerifica = {
  stato?: string;
  requisiti?: RequisitoRisultato[];
} | null;

type EmailAttachment = {
  filename: string;
  content: Buffer;
  contentType: string;
};

type DocumentoUrl = {
  nome?: string;
  filename?: string;
  url?: string;
  size?: number;
  type?: string;
  contentType?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function parseJsonField<T>(value: FormDataEntryValue | null, fallback: T): T {
  if (typeof value !== "string") return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function requireSmtpEnv() {
  const missing = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"].filter(
    (key) => !process.env[key]
  );

  if (missing.length) {
    throw new Error(`Configurazione SMTP mancante: ${missing.join(", ")}.`);
  }
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function cleanText(value: FormDataEntryValue | null): string {
  return String(value || "").trim();
}

function isSafeHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function formatFileSize(size?: number): string {
  if (!size || !Number.isFinite(size)) return "";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function buildContactBox() {
  return `
    <div style="margin:22px 0;padding:18px;border-radius:18px;background:#eff6ff;border:1px solid #bfdbfe;">
      <h3 style="margin:0 0 8px;color:#0f172a;">Hai bisogno di chiarimenti?</h3>
      <p style="margin:0 0 12px;color:#334155;">
        Un orientatore Laurea Smart può verificare gratuitamente il riepilogo e aiutarti a leggere correttamente SSD, CFU e requisiti della classe di concorso.
      </p>

      <p style="margin:0 0 10px;">
        <strong>Email:</strong>
        <a href="mailto:${LAUREA_SMART_EMAIL}" style="color:#1d4ed8;text-decoration:none;">${LAUREA_SMART_EMAIL}</a><br />
        <strong>WhatsApp:</strong>
        <a href="${LAUREA_SMART_WHATSAPP_URL}" style="color:#15803d;text-decoration:none;">${LAUREA_SMART_WHATSAPP}</a><br />
        <strong>Sito:</strong>
        <a href="${LAUREA_SMART_SITE}" style="color:#1d4ed8;text-decoration:none;">${LAUREA_SMART_SITE}</a>
      </p>

      <div style="display:inline-block;margin-top:4px;">
        <a href="${LAUREA_SMART_WHATSAPP_URL}" style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;padding:11px 15px;border-radius:999px;font-weight:700;">
          Scrivi su WhatsApp
        </a>
      </div>
    </div>
  `;
}

function buildRisultatoRows(requisiti: RequisitoRisultato[]) {
  return requisiti.length
    ? requisiti
        .map(
          (req: RequisitoRisultato) => `
          <tr>
            <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${escapeHtml(String(req.label || "Requisito"))}</td>
            <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${escapeHtml(String(req.cfuPosseduti ?? ""))}</td>
            <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${escapeHtml(String(req.cfuMancanti ?? ""))}</td>
            <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${req.soddisfatto ? "Sì" : "No"}</td>
          </tr>`
        )
        .join("")
    : `<tr><td colspan="4" style="padding:8px;">Nessun requisito CFU interpretato automaticamente o risultato da verificare manualmente.</td></tr>`;
}

function buildEsamiRows(esami: EsameConfermato[]) {
  return esami
    .map(
      (esame, index) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${index + 1}</td>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${escapeHtml(String(esame.nome || "Esame"))}</td>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${escapeHtml(String(esame.ssd || ""))}</td>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${escapeHtml(String(esame.cfu || ""))}</td>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${escapeHtml(String(esame.livello || ""))}</td>
        </tr>`
    )
    .join("");
}

function buildDocumentiRows(documentiValidi: DocumentoUrl[]) {
  return documentiValidi
    .map((documento, index) => {
      const url = String(documento.url || "").trim();
      const nomeDocumento = String(
        documento.nome || documento.filename || `Documento ${index + 1}`
      ).trim();
      const size = formatFileSize(documento.size);
      const typeValue = documento.type || documento.contentType || "";
      const type = typeValue ? ` — ${escapeHtml(String(typeValue))}` : "";

      return `
        <li style="margin-bottom:8px;">
          <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">
            ${escapeHtml(nomeDocumento)}
          </a>
          ${size ? `<span style="color:#6b7280;"> — ${escapeHtml(size)}</span>` : ""}
          ${type ? `<span style="color:#6b7280;">${type}</span>` : ""}
        </li>`;
    })
    .join("");
}

export async function POST(request: Request) {
  try {
    requireSmtpEnv();

    const formData = await request.formData();

    const nome = cleanText(formData.get("nome"));
    const email = cleanText(formData.get("email")).toLowerCase();
    const telefono = cleanText(formData.get("telefono"));
    const titolo = cleanText(formData.get("titolo"));
    const classe = cleanText(formData.get("classe"));
    const note = cleanText(formData.get("note"));

    const esami = parseJsonField<EsameConfermato[]>(formData.get("esami"), []);
    const risultato = parseJsonField<RisultatoVerifica>(formData.get("risultato"), null);
    const documentiUrl = parseJsonField<DocumentoUrl[]>(formData.get("documentiUrl"), []);

    if (!nome || !email || !telefono) {
      return NextResponse.json(
        { success: false, message: "Nome, email e telefono sono obbligatori." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: "Inserisci un indirizzo email valido." },
        { status: 400 }
      );
    }

    /*
      Supporto allegati mantenuto come fallback.
      Nella landing pubblica i documenti dovrebbero arrivare come link Blob
      nel campo documentiUrl, così evitiamo FUNCTION_PAYLOAD_TOO_LARGE.
    */
    const files = formData
      .getAll("files")
      .filter((item): item is File => item instanceof File && item.size > 0)
      .slice(0, MAX_FILES);

    const attachments: EmailAttachment[] = [];
    const fileWarnings: string[] = [];

    for (const file of files) {
      if (!ALLOWED_TYPES.has(file.type)) {
        fileWarnings.push(`${file.name}: formato non allegato perché non supportato.`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        fileWarnings.push(`${file.name}: non allegato perché superiore a 10 MB.`);
        continue;
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      attachments.push({
        filename: file.name || "documento-caricato",
        content: buffer,
        contentType: file.type,
      });
    }

    const documentiValidi = documentiUrl.filter((documento) => {
      const url = String(documento.url || "").trim();
      return url && isSafeHttpUrl(url);
    });

    const documentiRows = buildDocumentiRows(documentiValidi);
    const requisiti = Array.isArray(risultato?.requisiti) ? risultato.requisiti : [];
    const requisitiRows = buildRisultatoRows(requisiti);
    const esamiRows = buildEsamiRows(esami);

    const documentiSection = documentiValidi.length
      ? `
        <h3>Documenti caricati dall'utente</h3>
        <p>I documenti originali sono stati caricati su storage e sono disponibili tramite questi link:</p>
        <ul style="padding-left:20px;">
          ${documentiRows}
        </ul>
      `
      : attachments.length
      ? `<h3>Documenti allegati</h3><p>Sono presenti ${attachments.length} allegati nell'email inviata all'orientatore.</p>`
      : `<h3>Documenti caricati</h3><p>Nessun documento originale allegato o collegato.</p>`;

    const riepilogoHtml = `
      <h3>Titolo e classe</h3>
      <p>
        <strong>Titolo dichiarato:</strong> ${escapeHtml(titolo || "Non indicato")}<br />
        <strong>Classe richiesta:</strong> ${escapeHtml(classe || "Non indicata")}
      </p>

      <h3>Risultato automatico</h3>
      <p><strong>Stato:</strong> ${escapeHtml(String(risultato?.stato || "Da verificare"))}</p>

      <table style="border-collapse:collapse;width:100%;font-size:14px;">
        <thead>
          <tr style="background:#f3f4f6;">
            <th style="text-align:left;padding:8px;">Requisito</th>
            <th style="text-align:left;padding:8px;">Posseduti</th>
            <th style="text-align:left;padding:8px;">Mancanti</th>
            <th style="text-align:left;padding:8px;">OK</th>
          </tr>
        </thead>
        <tbody>${requisitiRows}</tbody>
      </table>

      <h3>Esami confermati</h3>

      <table style="border-collapse:collapse;width:100%;font-size:14px;">
        <thead>
          <tr style="background:#f3f4f6;">
            <th style="text-align:left;padding:8px;">#</th>
            <th style="text-align:left;padding:8px;">Esame</th>
            <th style="text-align:left;padding:8px;">SSD</th>
            <th style="text-align:left;padding:8px;">CFU</th>
            <th style="text-align:left;padding:8px;">Livello</th>
          </tr>
        </thead>
        <tbody>${esamiRows || `<tr><td colspan="5" style="padding:8px;">Nessun esame inserito.</td></tr>`}</tbody>
      </table>

      ${documentiSection}

      ${
        fileWarnings.length
          ? `<h3>Avvisi allegati</h3><p>${fileWarnings.map(escapeHtml).join("<br />")}</p>`
          : ""
      }

      <p style="margin-top:20px;font-size:13px;color:#6b7280;">
        Il controllo automatico è preliminare e richiede verifica manuale dell'orientatore.
      </p>
    `;

    const htmlOrientatore = `
      <div style="font-family:Arial,sans-serif;color:#111827;line-height:1.5;">
        <h2>Nuova verifica CFU da Laurea Smart</h2>
        <p>Un utente ha richiesto la verifica gratuita dei CFU per una classe di concorso.</p>

        <h3>Dati utente</h3>
        <p>
          <strong>Nome:</strong> ${escapeHtml(nome)}<br />
          <strong>Email:</strong> ${escapeHtml(email)}<br />
          <strong>Telefono:</strong> ${escapeHtml(telefono)}
        </p>

        ${riepilogoHtml}

        ${note ? `<h3>Note utente</h3><p>${escapeHtml(note).replace(/\n/g, "<br />")}</p>` : ""}
      </div>
    `;

    const htmlUtente = `
      <div style="font-family:Arial,sans-serif;color:#111827;line-height:1.5;">
        <h2>La tua verifica CFU preliminare</h2>
        <p>Ciao ${escapeHtml(nome)},</p>
        <p>
          abbiamo ricevuto la tua richiesta di verifica gratuita dei CFU.
          Di seguito trovi una copia del riepilogo generato da Laurea Smart.
        </p>

        ${buildContactBox()}

        ${riepilogoHtml}

        <div style="margin-top:22px;padding:16px;border-radius:16px;background:#f8fafc;border:1px solid #e2e8f0;">
          <p style="margin:0 0 8px;">
            <strong>Contatti Laurea Smart</strong>
          </p>
          <p style="margin:0;">
            Email:
            <a href="mailto:${LAUREA_SMART_EMAIL}" style="color:#1d4ed8;text-decoration:none;">${LAUREA_SMART_EMAIL}</a><br />
            WhatsApp:
            <a href="${LAUREA_SMART_WHATSAPP_URL}" style="color:#15803d;text-decoration:none;">${LAUREA_SMART_WHATSAPP}</a><br />
            Sito:
            <a href="${LAUREA_SMART_SITE}" style="color:#1d4ed8;text-decoration:none;">${LAUREA_SMART_SITE}</a>
          </p>
        </div>

        <p style="margin-top:18px;color:#475569;">
          Questa verifica è automatica e preliminare. Un orientatore potrà controllare i dati inseriti, i documenti caricati e le condizioni specifiche della classe di concorso.
        </p>
      </div>
    `;

    /*
      Parte SMTP mantenuta nella forma precedente:
      - host/port/secure da env
      - from diretto da SMTP_FROM o SMTP_USER
      - replyTo dell'utente per l'email interna all'orientatore
    */
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure:
        String(process.env.SMTP_SECURE || "").toLowerCase() === "true" ||
        Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.ORIENTATORE_EMAIL || LAUREA_SMART_EMAIL,
      replyTo: email,
      subject: "Nuova verifica CFU da Laurea Smart",
      html: htmlOrientatore,
      attachments,
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      replyTo: process.env.ORIENTATORE_EMAIL || LAUREA_SMART_EMAIL,
      subject: "La tua verifica CFU preliminare - Laurea Smart",
      html: htmlUtente,
    });

    return NextResponse.json({
      success: true,
      message: "Richiesta inviata correttamente.",
    });
  } catch (error) {
    console.error("INVIA_VERIFICA_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Errore durante l'invio della verifica.",
      },
      { status: 500 }
    );
  }
}
