import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "graduatoriegps.it",
  user: "rggradua",
  password: "Fra29Sus03",
  database: "rggradua_db01",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
