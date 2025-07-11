import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import firebase from 'firebase/app';
import 'firebase/database';  // Importando o módulo para Realtime Database

const app = express();
const port = process.env.PORT || 3000;

// Configuração do __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "sua-api-key",
  authDomain: "seu-auth-domain",
  databaseURL: "https://dados-teste-8b85d-default-rtdb.firebaseio.com/", // URL do seu banco de dados Firebase
  projectId: "seu-project-id",
  storageBucket: "seu-storage-bucket",
  messagingSenderId: "seu-messaging-sender-id",
  appId: "seu-app-id",
  measurementId: "seu-measurement-id"
};

// Inicializar o Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

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
    const ref = database.ref('usuarios'); // Refere-se à chave 'usuarios' no Firebase
    const snapshot = await ref.orderByChild('usuario').equalTo(usuario).once('value');
    const user = snapshot.val();

    if (user) {
      const userKey = Object.keys(user)[0]; // Pega a chave do usuário
      if (user[userKey].senha === senha) {
        // Se a senha estiver correta, criar o cookie de autenticação
        res.cookie('auth_token', 'logado', { httpOnly: true });
        res.redirect('/'); // Redireciona para a página inicial após o login bem-sucedido
      } else {
        res.redirect('/login.html?erro=1'); // Senha incorreta
      }
    } else {
      res.redirect('/login.html?erro=1'); // Usuário não encontrado
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
