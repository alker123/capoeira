import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import { db3 } from './firebase.js';  // Importa a instância do Firebase do arquivo firebase.js
import { ref, get, set, remove } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

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
  const userToken = req.cookies['auth_token']; // Supondo que o token seja armazenado no cookie

  if (!userToken) {
    return res.redirect('/login.html'); // Redireciona para login se não estiver autenticado
  }

  next(); // Se o token estiver presente, permite continuar
}

// Rota de Login (Login de exemplo)
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

// Rota para processar o login com dados do Firebase
app.post('/login', async (req, res) => {
  const { usuario, senha } = req.body;

  try {
    // Verificar se o usuário existe no Firebase
    const usersRef = ref(db3, 'usuarios'); // Usando a instância db3 importada
    const snapshot = await get(usersRef); // Pegando todos os usuários
    const users = snapshot.val();

    let userFound = false;
    let userKey = null;

    // Verificando se o usuário existe e se a senha corresponde
    for (const key in users) {
      if (users[key].usuario === usuario && users[key].senha === senha) {
        userFound = true;
        userKey = key;
        break;
      }
    }

    if (userFound) {
      // Se o usuário e a senha estiverem corretos, criar o cookie de autenticação
      res.cookie('auth_token', 'logado', { httpOnly: true });
      res.redirect('/'); // Redireciona para a página inicial após o login bem-sucedido
    } else {
      res.redirect('/login.html?erro=1'); // Usuário ou senha incorretos
    }
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.redirect('/login.html?erro=1'); // Em caso de erro
  }
});

// Página Inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Páginas protegidas com middleware de autenticação
app.get('/admin', isAuthenticated, (req, res) => {
  console.log('Acessando a página Admin...');
  res.sendFile(path.join(__dirname, 'public/admin.html'));
});

app.get('/operador', isAuthenticated, (req, res) => {
  console.log('Acessando a página Operador...');
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

// Logout (Remove o token de autenticação e redireciona para a página de login)
app.get('/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.redirect('/login.html'); // Redireciona de volta para login
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
