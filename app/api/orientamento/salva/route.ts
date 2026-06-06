import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch(
      "https://laureasmart.it/api/orientamento-gratuito-salva.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const text = await response.text();

    let data: unknown = null;

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = {
          success: response.ok,
          raw: text,
        };
      }
    } else {
      data = {
        success: response.ok,
        message: response.ok
          ? "Richiesta inviata correttamente all'endpoint PHP."
          : "Endpoint PHP raggiunto ma risposta vuota.",
      };
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Errore proxy orientamento:", error);

    return NextResponse.json(
      { success: false, error: "Errore proxy orientamento" },
      { status: 500 }
    );
  }
}
