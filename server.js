import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve arquivos da pasta public (ou raiz, se preferir)
app.use(express.static(path.join(__dirname, "public"))); // ou "." se tudo estiver na raiz

// Página inicial
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Rotas opcionais (para esconder .html)
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public/admin.html"));
});
app.get("/operador", (req, res) => {
  res.sendFile(path.join(__dirname, "public/operador.html"));
});
// (adicione juradoA, juradoB, etc. se quiser)

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
