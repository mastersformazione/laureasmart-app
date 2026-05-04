import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch(
      "https://graduatoriegps.it/api/orientamento-salva.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Errore proxy orientamento:", error);

    return NextResponse.json(
      { success: false, error: "Errore proxy orientamento" },
      { status: 500 }
    );
  }
}
