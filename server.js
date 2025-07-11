import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import { autenticarUsuario } from './auth.js';

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

function isAuthenticated(req, res, next) {
  const userToken = req.cookies['auth_token'];
  if (!userToken) {
    return res.redirect('/index.html');
  }
  next();
}

// Página inicial de login
app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Login via auth.js
app.post('/login', async (req, res) => {
  const { usuario, senha } = req.body;

  try {
    const tipo = await autenticarUsuario(usuario, senha);

    if (tipo) {
      res.cookie('auth_token', 'logado', { httpOnly: true });

      const rota = `/${tipo}`;
      return res.redirect(rota);
    } else {
      return res.redirect('/index.html?erro=1');
    }
  } catch (err) {
    return res.redirect('/index.html?erro=1');
  }
});

// Protegidas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

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
  res.redirect('/index.html');
});

// Start
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
