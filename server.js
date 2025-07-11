import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser"; // Para lidar com cookies (se necessário)

const app = express();
const port = process.env.PORT || 3000;

// Configuração do __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para lidar com cookies (caso você queira usar cookies para autenticação)
app.use(cookieParser());

// Serve arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, "public"))); // ou "." se tudo estiver na raiz

// Middleware de autenticação
function isAuthenticated(req, res, next) {
  const userToken = req.cookies["auth_token"]; // Supondo que você armazene o token no cookie

  if (!userToken) {
    return res.redirect("/login.html"); // Redireciona se não estiver autenticado
  }

  // Caso você use JWT, você pode verificar o token aqui
  // jwt.verify(userToken, secret, (err, decoded) => {
  //   if (err) {
  //     return res.redirect("/login.html");
  //   }
  //   req.user = decoded; // O usuário será acessível em req.user
  //   next();
  // });

  next(); // Se passar pela verificação, o acesso é permitido
}

// Rotas protegidas com autenticação
app.use("/admin", isAuthenticated);
app.use("/operador", isAuthenticated);
// Você pode adicionar mais rotas protegidas, como "/juradoA", etc.

// Página inicial
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Rotas específicas
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public/admin.html"));
});

app.get("/operador", (req, res) => {
  res.sendFile(path.join(__dirname, "public/operador.html"));
});

// Adicione outras rotas se necessário (como juradoA, juradoB, etc.)
app.get("/juradoA", (req, res) => {
  res.sendFile(path.join(__dirname, "public/juradoA.html"));
});

app.get("/juradoB", (req, res) => {
  res.sendFile(path.join(__dirname, "public/juradoB.html"));
});

app.get("/juradoC", (req, res) => {
  res.sendFile(path.join(__dirname, "public/juradoC.html"));
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
