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

// Middleware para analisar dados de formulários
app.use(express.urlencoded({ extended: true }));

// Serve arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Middleware de autenticação (Verificando se o usuário tem um token de autenticação)
function isAuthenticated(req, res, next) {
  const userToken = req.cookies['auth_token'];
  if (!userToken) {
    return res.redirect('/login.html');
  }
  next();
}

// Rota de Login (formulário)
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

// Rota para processar o login (simples, sem Firebase)
app.post('/login', async (req, res) => {
  const { usuario, senha } = req.body;

  // 🔒 Simulação simples de usuário/senha
  const usuariosValidos = {
    admin: '1234',
    operador: 'senha',
    jurado: 'abc123'
  };

  if (usuariosValidos[usuario] === senha) {
    res.cookie('auth_token', 'logado', { httpOnly: true });
    res.redirect('/');
  } else {
    res.redirect('/login.html?erro=1');
  }
});

// Página Inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Páginas protegidas
app.get('/admin', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public/admin.html'));
});

app.get('/operador', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public/operador.html'));
});

app.get('/juradoA', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public/juradoA.html'));
});

app.get('/juradoB', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public/juradoB.html'));
});

app.get('/juradoC', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public/juradoC.html'));
});

// Logout
app.get('/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.redirect('/login.html');
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
