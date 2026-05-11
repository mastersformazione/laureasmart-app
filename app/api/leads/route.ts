import mysql from "mysql2/promise";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    await connection.execute(
      "INSERT INTO leads (nome, email, telefono, interesse) VALUES (?, ?, ?, ?)",
      [body.nome, body.email, body.telefono, body.interesse]
    );

    await connection.end();

    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Errore DB" }), {
      status: 500,
    });
  }
}
