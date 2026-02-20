const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
<<<<<<< HEAD
=======
const session = require("express-session");
const bcrypt = require("bcrypt");
>>>>>>> 6b210bda634ba43bbbb9fa7504ffc10132feec5e

const app = express();
const PORT = process.env.PORT || 3000;

<<<<<<< HEAD
=======
app.use(session({
  secret: "dashaus_super_secreto_2026",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
>>>>>>> 6b210bda634ba43bbbb9fa7504ffc10132feec5e
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Criar tabelas automaticamente
(async () => {
<<<<<<< HEAD
=======

  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL
    )
  `);

>>>>>>> 6b210bda634ba43bbbb9fa7504ffc10132feec5e
  await pool.query(`
    CREATE TABLE IF NOT EXISTS funcionarios (
      id SERIAL PRIMARY KEY,
      nome TEXT NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS registros (
      id SERIAL PRIMARY KEY,
      funcionario_id INTEGER REFERENCES funcionarios(id),
      data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      latitude TEXT,
      longitude TEXT
    )
  `);
<<<<<<< HEAD
=======

>>>>>>> 6b210bda634ba43bbbb9fa7504ffc10132feec5e
})();

// Cadastrar funcionário
app.post("/funcionarios", async (req, res) => {
  const { nome } = req.body;
  await pool.query("INSERT INTO funcionarios (nome) VALUES ($1)", [nome]);
  res.json({ message: "Funcionário cadastrado!" });
});

// Listar funcionários
app.get("/funcionarios", async (req, res) => {
  const result = await pool.query("SELECT * FROM funcionarios");
  res.json(result.rows);
});

// Registrar ponto
app.post("/bater-ponto", async (req, res) => {
  const { funcionario_id, latitude, longitude } = req.body;

  await pool.query(
    "INSERT INTO registros (funcionario_id, latitude, longitude) VALUES ($1,$2,$3)",
    [funcionario_id, latitude, longitude]
  );

  res.json({ message: "Ponto registrado com sucesso!" });
});

// Listar registros
app.get("/registros", async (req, res) => {
  const result = await pool.query(`
    SELECT r.*, f.nome 
    FROM registros r
    JOIN funcionarios f ON f.id = r.funcionario_id
    ORDER BY r.data DESC
  `);
  res.json(result.rows);
});

// Exportar Excel
app.get("/exportar-excel", async (req, res) => {
  const result = await pool.query(`
    SELECT f.nome, r.data, r.latitude, r.longitude
    FROM registros r
    JOIN funcionarios f ON f.id = r.funcionario_id
  `);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Relatório");

  sheet.columns = [
    { header: "Nome", key: "nome" },
    { header: "Data", key: "data" },
    { header: "Latitude", key: "latitude" },
    { header: "Longitude", key: "longitude" }
  ];

  result.rows.forEach(row => sheet.addRow(row));

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment; filename=relatorio.xlsx");

  await workbook.xlsx.write(res);
  res.end();
});

// Exportar PDF
app.get("/exportar-pdf", async (req, res) => {
  const result = await pool.query(`
    SELECT f.nome, r.data
    FROM registros r
    JOIN funcionarios f ON f.id = r.funcionario_id
  `);

  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=relatorio.pdf");

  doc.pipe(res);
  doc.fontSize(16).text("Relatório de Ponto - Das Haus Marcenaria");
  doc.moveDown();

  result.rows.forEach(row => {
    doc.text(`${row.nome} - ${row.data}`);
  });

  doc.end();
});

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
<<<<<<< HEAD
=======

(async () => {
  const email = "erickangst1234@gmail.com";
  const senha = "DasHaus2026";

  const hash = await bcrypt.hash(senha, 10);

  const adminExistente = await pool.query(
    "SELECT * FROM admins WHERE email = $1",
    [email]
  );

  if (adminExistente.rows.length === 0) {
    await pool.query(
      "INSERT INTO admins (email, senha) VALUES ($1, $2)",
      [email, hash]
    );
    console.log("Admin criado automaticamente!");
  }
})();

app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  const admin = await pool.query(
    "SELECT * FROM admins WHERE email=$1",
    [email]
  );

  if (admin.rows.length === 0) {
    return res.json({ success: false });
  }

  const senhaValida = await bcrypt.compare(
    senha,
    admin.rows[0].senha
  );

  if (!senhaValida) {
    return res.json({ success: false });
  }

  req.session.adminId = admin.rows[0].id;

  res.json({ success: true });
});

function protegerAdmin(req, res, next) {
  if (!req.session.adminId) {
    return res.redirect("/login.html");
  }
  next();
}

app.get("/admin.html", protegerAdmin, (req, res) => {
  res.sendFile(__dirname + "/public/admin.html");
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login.html");
});
>>>>>>> 6b210bda634ba43bbbb9fa7504ffc10132feec5e
