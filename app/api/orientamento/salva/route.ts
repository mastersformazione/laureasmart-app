import { NextResponse } from "next/server";

const PHP_ENDPOINT =
  "https://laureasmart.it/api/orientamento-gratuito-salva.php";

type OrientamentoPayload = Record<string, unknown>;

function getString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as OrientamentoPayload;

    const email =
      getString(body.email) ||
      getString(body.user_email) ||
      getString(body.userEmail) ||
      getString(body.mail);

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email obbligatoria" },
        { status: 400 }
      );
    }

    const normalizedBody: OrientamentoPayload = {
      ...body,
      email,
      user_email: email,
      nome: getString(body.nome) || getString(body.user_nome) || "Utente",
      user_nome: getString(body.user_nome) || getString(body.nome) || "Utente",
      test_source: getString(body.test_source) || "orientamento_gratuito_app",
    };

    const response = await fetch(PHP_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
      },
      body: JSON.stringify(normalizedBody),
    });

    const text = await response.text();

    if (!text) {
      return NextResponse.json(
        {
          success: response.ok,
          message: response.ok
            ? "Richiesta inviata correttamente all'endpoint PHP."
            : "Endpoint PHP raggiunto ma risposta vuota.",
        },
        { status: response.status }
      );
    }

    try {
      const data = JSON.parse(text);
      return NextResponse.json(data, { status: response.status });
    } catch {
      return NextResponse.json(
        {
          success: response.ok,
          raw: text,
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Errore proxy orientamento:", error);

    return NextResponse.json(
      { success: false, error: "Errore proxy orientamento" },
      { status: 500 }
    );
  }
}
