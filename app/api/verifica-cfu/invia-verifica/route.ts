import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);

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
  const missing = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"].filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Configurazione SMTP mancante: ${missing.join(", ")}.`);
  }
}

export async function POST(request: Request) {
  try {
    requireSmtpEnv();

    const formData = await request.formData();
    const nome = String(formData.get("nome") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const telefono = String(formData.get("telefono") || "").trim();
    const titolo = String(formData.get("titolo") || "").trim();
    const classe = String(formData.get("classe") || "").trim();
    const note = String(formData.get("note") || "").trim();
    const esami = parseJsonField<any[]>(formData.get("esami"), []);
    const risultato = parseJsonField<any>(formData.get("risultato"), null);

    if (!nome || !email || !telefono) {
      return NextResponse.json(
        { success: false, message: "Nome, email e telefono sono obbligatori." },
        { status: 400 }
      );
    }

    const files = formData
      .getAll("files")
      .filter((item): item is File => item instanceof File && item.size > 0)
      .slice(0, MAX_FILES);

    const attachments = [];
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

    const requisiti = Array.isArray(risultato?.requisiti) ? risultato.requisiti : [];
    const esamiRows = esami
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

    const requisitiRows = requisiti.length
      ? requisiti
          .map(
            (req: any) => `
            <tr>
              <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${escapeHtml(String(req.label || "Requisito"))}</td>
              <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${escapeHtml(String(req.cfuPosseduti ?? ""))}</td>
              <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${escapeHtml(String(req.cfuMancanti ?? ""))}</td>
              <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${req.soddisfatto ? "Sì" : "No"}</td>
            </tr>`
          )
          .join("")
      : `<tr><td colspan="4" style="padding:8px;">Nessun requisito CFU interpretato automaticamente o risultato da verificare manualmente.</td></tr>`;

    const html = `
      <div style="font-family:Arial,sans-serif;color:#111827;line-height:1.5;">
        <h2>Nuova verifica CFU da Laurea Smart</h2>
        <p>Un utente ha richiesto la verifica gratuita dei CFU per una classe di concorso.</p>

        <h3>Dati utente</h3>
        <p><strong>Nome:</strong> ${escapeHtml(nome)}<br />
        <strong>Email:</strong> ${escapeHtml(email)}<br />
        <strong>Telefono:</strong> ${escapeHtml(telefono)}</p>

        <h3>Titolo e classe</h3>
        <p><strong>Titolo dichiarato:</strong> ${escapeHtml(titolo || "Non indicato")}<br />
        <strong>Classe richiesta:</strong> ${escapeHtml(classe || "Non indicata")}</p>

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

        <h3>Esami confermati dall'utente</h3>
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

        ${note ? `<h3>Note utente</h3><p>${escapeHtml(note).replace(/\n/g, "<br />")}</p>` : ""}
        ${fileWarnings.length ? `<h3>Avvisi allegati</h3><p>${fileWarnings.map(escapeHtml).join("<br />")}</p>` : ""}

        <p style="margin-top:20px;font-size:13px;color:#6b7280;">Il controllo automatico è preliminare e richiede verifica manuale dell'orientatore.</p>
      </div>
    `;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || "").toLowerCase() === "true" || Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.ORIENTATORE_EMAIL || "info@laureasmart.it",
      replyTo: email,
      subject: "Nuova verifica CFU da Laurea Smart",
      html,
      attachments,
    });

    return NextResponse.json({ success: true, message: "Richiesta inviata correttamente." });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Errore durante l'invio della verifica.",
      },
      { status: 500 }
    );
  }
}
