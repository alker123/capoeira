import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

const app = express();
const port = process.env.PORT || 3000;

// Configuração do __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para lidar com cookies
app.use(cookieParser());

// Serve arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Middleware de autenticação (Verificando se o usuário tem um token de autenticação)
function isAuthenticated(req, res, next) {
  const userToken = req.cookies['auth_token']; // Supondo que o token seja armazenado no cookie

  if (!userToken) {
    return res.redirect('/login.html'); // Redireciona para login se não estiver autenticado
  }

  // Aqui você pode verificar a validade do token, se usar JWT, por exemplo:
  // jwt.verify(userToken, secret, (err, decoded) => {
  //   if (err) {
  //     return res.redirect("/login.html");
  //   }
  //   req.user = decoded; // Pode colocar o usuário autenticado em req.user
  //   next();
  // });

  next(); // Se o token estiver presente, permite continuar
}

// Rota de Login (Login de exemplo - você deve configurar a lógica real)
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

// Página Inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Páginas protegidas com middleware de autenticação
app.get('/admin', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public/admin.html'));
});

app.get('/operador', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public/operador.html'));
});

// Outras páginas restritas
app.get('/juradoA', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public/juradoA.html'));
});

app.get('/juradoB', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public/juradoB.html'));
});

app.get('/juradoC', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public/juradoC.html'));
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
