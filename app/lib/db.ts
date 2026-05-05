import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "laureasmart.it",
  user: "plaureaa_u01",
  password: "Fra29Sus03",
  database: "plaureaa_db01",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
